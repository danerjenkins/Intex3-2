using System.Security.Claims;
using IntexS3G2.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntexS3G2.API.Services;

#if DEBUG
DotNetEnv.Env.Load(); // loads from .env by default
#endif
Console.WriteLine("=== Starting Intex Backend ===");


var builder = WebApplication.CreateBuilder(args);

// Set up connection string for Identity Database
var isDev = builder.Environment.IsDevelopment();

var identityConnection = isDev
    ? builder.Configuration["IdentityConnection"]
    : Environment.GetEnvironmentVariable("IdentityConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(identityConnection, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

var movieConnection = isDev
    ? builder.Configuration["MovieConnection"]
    : Environment.GetEnvironmentVariable("MovieConnection");

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(movieConnection, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

builder.Services.AddDbContext<ContentDbContext>(options => 
    options.UseSqlite(builder.Configuration.GetConnectionString("ContentConnection")));

    Console.WriteLine($"[Startup] IdentityConnection: {identityConnection}");
Console.WriteLine($"[Startup] MovieConnection: {movieConnection}");



AppContext.SetSwitch("Microsoft.AspNetCore.Mvc.SuppressApiExplorerErrors", false);


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
// Add authentication
// builder.Services.AddIdentityApiEndpoints<IdentityUser>()
//     .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims

        // 🔐 This makes passwords harder to guess
    options.Password.RequireDigit = true;           // Must have at least one number (like 1, 2, 3)
    options.Password.RequireLowercase = true;       // Must have lowercase letters (like a, b, c)
    options.Password.RequireUppercase = true;       // Must have capital letters (like A, B, C)
    options.Password.RequireNonAlphanumeric = true; // Must have symbols (like !, @, #)
    options.Password.RequiredLength = 8;            // Must be at least 8 characters long
    options.Password.RequiredUniqueChars = 1;       // Must have at least 1 unique character
});
// Add Identity services
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true; // Set HttpOnly to true
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Always use secure cookies
    options.Cookie.SameSite = SameSiteMode.None; // Set SameSite to None
    options.Cookie.Name = ".AspNetCore.Identity.Application"; // Ensure the cookie name is set correctly
    options.LoginPath = "/login"; // Set the login path
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "https://zealous-water-07b22b61e.6.azurestaticapps.net","yourmomshouse.com") // Replace with your frontend URL
                .AllowCredentials() // Required to allow cookies
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
WebApplication app;
try
{
    app = builder.Build();
    Console.WriteLine("✅ App built successfully.");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Failed to build app: {ex.Message}");
    throw;
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

// Add custom endpoints for health checks and other functionalities
app.MapGet("/deployed-test", () => "This is the latest deployed version!");
app.MapGet("/db-check", async (ApplicationDbContext db) =>
{
    try
    {
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var userCount = await db.Users.CountAsync(cts.Token);
        return Results.Ok(new { message = "✅ DB connected", users = userCount });
    }
    catch (OperationCanceledException)
    {
        return Results.Problem("❌ DB check timed out.");
    }
    catch (Exception ex)
    {
        return Results.Problem($"❌ DB check failed: {ex.Message}");
    }
});
app.MapGet("/movies-db-check", async (MovieDbContext db) =>
{
    try
    {
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var movieCount = await db.Titles.CountAsync(cts.Token); // or any known DbSet
        return Results.Ok(new
        {
            message = "✅ Movies DB connected",
            movieCount
        });
    }
    catch (OperationCanceledException)
    {
        return Results.Problem("❌ Movies DB check timed out.");
    }
    catch (Exception ex)
    {
        return Results.Problem($"❌ Movies DB check failed: {ex.Message}");
    }
});
app.MapGet("/env-check", () =>
{
    var dbPassword = Environment.GetEnvironmentVariable("AUTH_DB_PASSWORD");
    return Results.Ok(new
    {
        hasPassword = !string.IsNullOrWhiteSpace(dbPassword),
        length = dbPassword?.Length
    });
});
app.MapGet("/", () => Results.Ok("✅ Backend is alive"));

// Add login endpoint
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true, // Ensure the cookie is deleted securely
        SameSite = SameSiteMode.None // Set SameSite to None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Add ping endpoint for authentication check
app.MapGet("/pingauth", async (ClaimsPrincipal user, UserManager<IdentityUser> userManager) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com"; // Ensure it's never null
    var identityUser = await userManager.FindByEmailAsync(email);
    var roles = await userManager.GetRolesAsync(identityUser);

    return Results.Json(new { email = email ?? "", role = roles.FirstOrDefault() ?? "" }); // Return as JSON
}).RequireAuthorization();

app.Run();
using System.Security.Claims;
using IntexS3G2.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntexS3G2.API.Services;

#if DEBUG
DotNetEnv.Env.Load(); // loads from .env by default
#endif

var builder = WebApplication.CreateBuilder(args);
var isDev = builder.Environment.IsDevelopment();
var connectionString = isDev 
                ? builder.Configuration["IdentityConnection"]
                : Environment.GetEnvironmentVariable("IdentityConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new Exception("❌ IdentityConnection not found in config or environment.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

AppContext.SetSwitch("Microsoft.AspNetCore.Mvc.SuppressApiExplorerErrors", false);


 

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddDbContext<CompetitionDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("CompetitionConnection")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true; // Set HttpOnly to true
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Always use secure cookies
    options.Cookie.SameSite = SameSiteMode.None; // Set SameSite to None
    options.Cookie.Name = ".AspNetCore.Identity.Application"; // Ensure the cookie name is set correctly
    options.LoginPath = "/login"; // Set the login path
});

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
var app = builder.Build();

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
app.MapGet("/env-check", () =>
{
    var dbPassword = Environment.GetEnvironmentVariable("AUTH_DB_PASSWORD");
    return Results.Ok(new
    {
        hasPassword = !string.IsNullOrWhiteSpace(dbPassword),
        length = dbPassword?.Length
    });
});
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


app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com"; // Ensure it's never null
    return Results.Json(new { email = email }); // Return as JSON
}).RequireAuthorization();

app.Run();
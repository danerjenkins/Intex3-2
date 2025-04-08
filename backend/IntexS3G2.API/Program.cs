using System.Security.Claims;
using IntexS3G2.API.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IntexS3G2.API.Services;

DotNetEnv.Env.Load(); // loads from .env by default

AppContext.SetSwitch("Microsoft.AspNetCore.Mvc.SuppressApiExplorerErrors", false);

var builder = WebApplication.CreateBuilder(args);
 

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddDbContext<CompetitionDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("CompetitionConnection")));

// Get the password from environment
var dbPassword = Environment.GetEnvironmentVariable("AUTH_DB_PASSWORD");

// Get the raw connection string from appsettings
var rawConnString = builder.Configuration.GetConnectionString("IdentityConnection");

// Replace the placeholder with the actual password
var finalConnString = rawConnString.Replace("__AUTH_DB_PASSWORD__", dbPassword ?? "");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(finalConnString));

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
app.MapGet("/env-check", (IConfiguration config) =>
{
    var conn = config.GetConnectionString("IdentityConnection");
    return Results.Ok(new { conn });
});
app.MapGet("/db-check", async (ApplicationDbContext db) =>
{
    try
    {
        var userCount = await db.Users.CountAsync(); // or another small query
        return Results.Ok(new { message = "✅ DB connected!", users = userCount });
    }
    catch (Exception ex)
    {
        return Results.Problem($"❌ DB check failed: {ex.Message}");
    }
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
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace IntexS3G2.API.Services;

public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<IdentityUser>
{
    public CustomUserClaimsPrincipalFactory(
        UserManager<IdentityUser> userManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, optionsAccessor) { }
    //See logoutpingauth video for why this was created
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(IdentityUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        
        identity.AddClaim(new Claim(ClaimTypes.Email, user.Email ?? "")); // Ensure email claim is always present
        
        // ✅ Add the role claims manually
        var roles = await UserManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
        }
        
        return identity;
    }
}
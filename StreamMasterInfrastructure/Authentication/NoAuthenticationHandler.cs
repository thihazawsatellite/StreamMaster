using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using StreamMasterDomain.Authentication;
using StreamMasterDomain.Enums;

using System.Security.Claims;
using System.Text.Encodings.Web;

namespace StreamMasterInfrastructure.Authentication
{
    public class NoAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public NoAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var claims = new List<Claim>
            {
                new Claim("user", "Anonymous"),
                new Claim("AuthType", AuthenticationType.None.ToString())
            };

            var identity = new ClaimsIdentity(claims, "NoAuth", "user", "identifier");
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, "NoAuth");

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}

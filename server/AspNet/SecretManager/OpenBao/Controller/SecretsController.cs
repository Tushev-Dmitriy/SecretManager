using Microsoft.AspNetCore.Mvc;
using SecretManager.OpenBao.Services;

namespace SecretManager.OpenBao.Controllers
{
    [ApiController]
    [Route("api/openbao")]
    public class SecretsController : ControllerBase
    {
        private readonly OpenBaoService _bao;
        private readonly string _token;

        public SecretsController(OpenBaoService bao, IConfiguration config)
        {
            _bao = bao;
            _token = config["OpenBao:Token"] ?? throw new InvalidOperationException("Missing token");
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetSecret(string name, CancellationToken ct)
        {
            var secret = await _bao.GetSecretAsync(name, _token, ct);
            return secret == null ? NotFound() : Ok(secret);
        }

        [HttpPost("{name}")]
        public async Task<IActionResult> SaveSecret(string name, [FromBody] Dictionary<string, string> secret, CancellationToken ct)
        {
            await _bao.SaveSecretAsync(name, secret, _token, ct);
            return Ok(new { message = "Secret saved" });
        }

        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteSecret(string name, CancellationToken ct)
        {
            await _bao.DeleteSecretAsync(name, _token, ct);
            return Ok(new { message = "Secret deleted" });
        }
    }
}

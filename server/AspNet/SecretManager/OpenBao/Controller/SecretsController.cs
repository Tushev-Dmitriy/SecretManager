using Microsoft.AspNetCore.Mvc;
using SecretManager.OpenBao.Services;

namespace SecretManager.OpenBao.Controllers
{
    [ApiController]
    [Route("api/openbao")]
    public class SecretsController : ControllerBase
    {
        private readonly OpenBaoService _bao;

        public SecretsController(OpenBaoService bao)
        {
            _bao = bao;
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetSecret(
            string name,
            [FromHeader(Name = "X-Vault-Token")] string token,
            CancellationToken ct)
        {
            try
            {
                var secret = await _bao.GetSecretAsync(name, token, ct);
                return secret == null ? NotFound() : Ok(secret);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { message = "OpenBao request failed", detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> ListSecrets(
            [FromHeader(Name = "X-Vault-Token")] string token,
            CancellationToken ct)
        {
            try
            {
                var secrets = await _bao.ListSecretsAsync(token, ct);
                return Ok(secrets);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { message = "OpenBao request failed", detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        [HttpPost("{name}")]
        public async Task<IActionResult> SaveSecret(
            string name,
            [FromBody] Dictionary<string, string> secret,
            [FromHeader(Name = "X-Vault-Token")] string token,
            CancellationToken ct)
        {
            try
            {
                await _bao.SaveSecretAsync(name, secret, token, ct);
                return Ok(new { message = "Secret saved" });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { message = "OpenBao request failed", detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteSecret(
            string name,
            [FromHeader(Name = "X-Vault-Token")] string token,
            CancellationToken ct)
        {
            try
            {
                await _bao.DeleteSecretAsync(name, token, ct);
                return Ok(new { message = "Secret deleted" });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { message = "OpenBao request failed", detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }
    }
}

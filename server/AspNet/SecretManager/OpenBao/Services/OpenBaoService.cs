using System.Net.Http.Json;
using System.Text.Json;

namespace SecretManager.OpenBao.Services
{
    public class OpenBaoService
    {
        private readonly HttpClient _http;

        public OpenBaoService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _http.BaseAddress = new Uri(config["OpenBao:Url"]!);
        }

        public async Task<Dictionary<string, string>?> GetSecretAsync(string path, string token, CancellationToken ct = default)
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, $"v1/secret/data/{path}");
            request.Headers.Add("X-Vault-Token", token);

            using var response = await _http.SendAsync(request, ct);
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            return json.GetProperty("data").GetProperty("data").Deserialize<Dictionary<string, string>>();
        }

        public async Task SaveSecretAsync(string path, Dictionary<string, string> data, string token, CancellationToken ct = default)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, $"v1/secret/data/{path}")
            {
                Content = JsonContent.Create(new { data })
            };
            request.Headers.Add("X-Vault-Token", token);
            var response = await _http.SendAsync(request, ct);
            response.EnsureSuccessStatusCode();
        }

        public async Task DeleteSecretAsync(string path, string token, CancellationToken ct = default)
        {
            using var request = new HttpRequestMessage(HttpMethod.Delete, $"v1/secret/metadata/{path}");
            request.Headers.Add("X-Vault-Token", token);
            await _http.SendAsync(request, ct);
        }
    }
}

using Microsoft.Extensions.Configuration;
using SecretManager.OpenBao.Services;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class OpenBaoInitializer
{
    private readonly OpenBaoService _bao;
    private readonly string _token;

    public OpenBaoInitializer(OpenBaoService bao, IConfiguration config)
    {
        _bao = bao;
        _token = config["OpenBao:Token"]!;
    }

    public async Task SeedAllAsync()
    {
        var secrets = new List<(string Name, Dictionary<string, string> Data, string Category)>
        {
            ("grafana-api", new Dictionary<string, string> { { "api_key", "grafana-xyz-987" } }, "REST_endpoints"),
            ("production-db", new Dictionary<string, string>
                {
                    { "username", "db_admin" },
                    { "password", "SuperSecret123" },
                    { "host", "prod-db.local" }
                }, "PostgreSQL"),
            ("jenkins-token", new Dictionary<string, string> { { "token", "jenkins-abc-123" }, { "job", "deploy-production" } }, "Jenkins"),
            ("telegram-bot", new Dictionary<string, string> { { "bot_token", "123456789:ABCDEF-TelegramSecret" } }, "REST_endpoints")
        };

        foreach (var secret in secrets)
        {
            await _bao.SaveSecretAsync(secret.Name, secret.Data, _token, CancellationToken.None);
            Console.WriteLine($"Секрет {secret.Name} создан!");
        }
    }
}

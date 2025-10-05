using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models;
using SecretManager.OpenBao.Services;
using System.Collections.Generic;
using System.Threading;

namespace SecretManager.OpenBao.Controllers
{
    [ApiController]
    [Route("api/openbao")]
    public class SecretsController : ControllerBase
    {
        private readonly OpenBaoService _bao;
        private readonly ApplicationDbContext _db;
        private readonly string _token;

        public SecretsController(OpenBaoService bao, ApplicationDbContext db, IConfiguration config)
        {
            _bao = bao;
            _db = db;
            _token = config["OpenBao:Token"] ?? throw new InvalidOperationException("Missing token");
        }

        /// <summary>
        /// Добавление секрета и запись в KeyTypes
        /// </summary>
        /// <param name="name">Имя секрета</param>
        /// <param name="dto">Данные секрета + категория</param>
        [HttpPost("{name}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SaveSecret(string name, [FromBody] SecretDto dto, CancellationToken ct)
        {
            await _bao.SaveSecretAsync(name, dto.Data, _token, ct);

            var keyType = await _db.KeyTypes.FirstOrDefaultAsync(k => k.Name == name);
            if (keyType == null)
            {
                keyType = new KeyType { Name = name, Category = dto.Category };
                _db.KeyTypes.Add(keyType);
            }
            else
            {
                keyType.Category = dto.Category;
            }
            await _db.SaveChangesAsync();

            return Ok(new { message = "Secret saved and KeyType updated" });
        }

        /// <summary>
        /// Получить секрет из OpenBao
        /// </summary>
        [HttpGet("{name}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetSecret(string name, CancellationToken ct)
        {
            var secret = await _bao.GetSecretAsync(name, _token, ct);
            return secret == null ? NotFound() : Ok(secret);
        }

        /// <summary>
        /// Удалить секрет
        /// </summary>
        [HttpDelete("{name}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteSecret(string name, CancellationToken ct)
        {
            await _bao.DeleteSecretAsync(name, _token, ct);
            return Ok(new { message = "Secret deleted" });
        }

        /// <summary>
        /// Получить все категории из Enum Category
        /// </summary>
        [HttpGet("categories")]
        [ProducesResponseType(200)]
        public IActionResult GetCategories()
        {
            var categories = Enum.GetNames(typeof(Category));
            return Ok(categories);
        }

        [HttpGet("search")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> SearchSecrets([FromQuery] string? q, [FromQuery] string? category)
        {
            var query = _db.KeyTypes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(k => k.Category == category);

            if (!string.IsNullOrWhiteSpace(q))
            {
                var pattern = $"%{q}%";
                query = query.Where(k =>
                    EF.Functions.ILike(k.Name, pattern) ||
                    EF.Functions.ILike(k.Category, pattern)
                );
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }

    }

    public class SecretDto
    {
        public Dictionary<string, string> Data { get; set; } = null!;
        public string Category { get; set; } = null!;
    }
}

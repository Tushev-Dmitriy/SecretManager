using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models;

namespace SecretManager.Keys.Controller
{
    [ApiController]
    [Route("api/keys")]
    public class KeysController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public KeysController(ApplicationDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Получить все выданные ключи или по конкретному типу ключа
        /// </summary>
        /// <param name="keyTypeId">Необязательный Id типа ключа</param>
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetKeys([FromQuery] int? keyTypeId, [FromQuery] string? q)
        {
            var query = _db.IssuedKeys.Include(k => k.KeyType).AsQueryable();

            if (keyTypeId.HasValue)
                query = query.Where(k => k.KeyTypeId == keyTypeId.Value);

            if (!string.IsNullOrWhiteSpace(q))
            {
                var pattern = $"%{q}%";
                query = query.Where(k =>
                    EF.Functions.ILike(k.KeyType.Name, pattern) ||
                    EF.Functions.ILike(k.UserId.ToString(), pattern) // по ID пользователя тоже можно
                );
            }

            return Ok(await query.ToListAsync());
        }

        /// <summary>
        /// Получить все ключи конкретного пользователя
        /// </summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetUserKeys(Guid userId)
        {
            var keys = await _db.IssuedKeys
                .Include(k => k.KeyType)
                .Where(k => k.UserId == userId)
                .ToListAsync();
            return Ok(keys);
        }

        /// <summary>
        /// Получить все типы ключей (KeyTypes)
        /// </summary>
        [HttpGet("types")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetTypes() =>
            Ok(await _db.KeyTypes.ToListAsync());
    }

    /// <summary>
    /// DTO для выдачи ключа
    /// </summary>
    public class IssueKeyDto
    {
        /// <summary>Id пользователя, которому выдается ключ</summary>
        public Guid UserId { get; set; }

        /// <summary>Id типа ключа (KeyType)</summary>
        public int KeyTypeId { get; set; }

        /// <summary>Срок действия ключа (необязательный)</summary>
        public DateTime? ExpiresAt { get; set; }
    }
}

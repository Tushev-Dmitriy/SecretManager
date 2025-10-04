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
        private readonly KeysDbContext _db;

        public KeysController(KeysDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetKeys([FromQuery] int? keyTypeId)
        {
            var query = _db.IssuedKeys.Include(k => k.KeyType).AsQueryable();
            if (keyTypeId.HasValue)
                query = query.Where(k => k.KeyTypeId == keyTypeId.Value);

            return Ok(await query.ToListAsync());
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes() =>
            Ok(await _db.KeyTypes.ToListAsync());
    }
}

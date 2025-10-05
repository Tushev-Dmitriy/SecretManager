using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models;

namespace SecretManager.Keys.Service
{
    public class KeysService
    {
        private readonly ApplicationDbContext _db;

        public KeysService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<IssuedKey> AddIssuedKeyAsync(Guid userId, int keyTypeId, DateTime? expiresAt = null)
        {
            var issuedKey = new IssuedKey
            {
                UserId = userId,
                KeyTypeId = keyTypeId,
                IssuedAt = DateTime.UtcNow,
                ExpiresAt = expiresAt
            };

            await _db.IssuedKeys.AddAsync(issuedKey);
            await _db.SaveChangesAsync();

            return issuedKey;
        }

        public async Task<List<IssuedKey>> GetKeysByTypeAsync(int keyTypeId)
        {
            return await _db.IssuedKeys
                .Include(k => k.KeyType)
                .Where(k => k.KeyTypeId == keyTypeId)
                .ToListAsync();
        }
    }
}

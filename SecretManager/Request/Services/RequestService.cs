using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models.UserEntity;

namespace SecretManager.Common.Services
{
    public class RequestService
    {
        private readonly ApplicationDbContext _db;

        public RequestService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Models.UserEntity.Request> CreateRequestAsync(Guid userId, string resource, string reason)
        {
            var request = new Models.UserEntity.Request
            {
                userId = userId,
                resource = resource,
                reason = reason,
                status = Status.PENDING,
                createdAt = DateTime.UtcNow
            };

            await _db.Request.AddAsync(request).ConfigureAwait(false);
            await _db.SaveChangesAsync().ConfigureAwait(false);

            return request;
        }

        public async Task<List<Models.UserEntity.Request>> GetRequestsByUserAsync(Guid userId)
        {
            return await _db.Request
                            .Where(r => r.userId == userId)
                            .OrderByDescending(r => r.createdAt)
                            .ToListAsync()
                            .ConfigureAwait(false);
        }

        public async Task<List<Models.UserEntity.Request>> GetAllRequestsAsync()
        {
            return await _db.Request
                            .OrderByDescending(r => r.createdAt)
                            .ToListAsync()
                            .ConfigureAwait(false);
        }

        public async Task<Models.UserEntity.Request?> UpdateRequestStatusAsync(Guid requestId, Status newStatus)
        {
            var request = await _db.Request.FindAsync(requestId).ConfigureAwait(false);
            if (request == null) return null;

            request.status = newStatus;
            await _db.SaveChangesAsync().ConfigureAwait(false);

            return request;
        }
    }
}

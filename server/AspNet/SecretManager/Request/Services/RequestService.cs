using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models.UserEntity;

namespace SecretManager.Request.Services
{
    public class RequestService
    {
        private readonly ApplicationDbContext _db;

        public RequestService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Common.Models.UserEntity.Request> CreateRequestAsync(Guid userId, string resource, string reason)
        {
            var request = new Common.Models.UserEntity.Request
            {
                userId = userId,
                resource = resource,
                reason = reason,
                status = Status.PENDING,
                createdAt = DateTime.UtcNow
            };

            await _db.Request.AddAsync(request);
            await _db.SaveChangesAsync();

            return request;
        }

        public async Task<List<Common.Models.UserEntity.Request>> GetRequestsByUserAsync(Guid userId) =>
            await _db.Request.Where(r => r.userId == userId)
                             .OrderByDescending(r => r.createdAt)
                             .ToListAsync();

        public async Task<List<Common.Models.UserEntity.Request>> GetAllRequestsAsync() =>
            await _db.Request.OrderByDescending(r => r.createdAt).ToListAsync();

        public async Task<Common.Models.UserEntity.Request?> UpdateRequestStatusAsync(Guid requestId, Status newStatus)
        {
            var request = await _db.Request.FindAsync(requestId);
            if (request == null) return null;

            request.status = newStatus;
            await _db.SaveChangesAsync();
            return request;
        }

        public async Task<Common.Models.UserEntity.Request?> UpdateRequestAsync(Common.Models.UserEntity.Request request)
        {
            _db.Request.Update(request);
            await _db.SaveChangesAsync();
            return request;
        }
    }
}

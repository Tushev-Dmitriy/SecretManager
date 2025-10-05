using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Data;
using SecretManager.Common.Models;
using SecretManager.Common.Models.UserEntity;
using SecretManager.OpenBao.Services;
using SecretManager.Request.Services;

namespace SecretManager.Requests.Controller
{
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        private readonly RequestService _requests;
        private readonly OpenBaoService _openBao;
        private readonly ApplicationDbContext _db;
        private readonly string _token;

        public RequestsController(RequestService requests, OpenBaoService openBao, ApplicationDbContext db, IConfiguration config)
        {
            _requests = requests;
            _openBao = openBao;
            _db = db;
            _token = config["OpenBao:Token"] ?? throw new InvalidOperationException("Missing OpenBao token");
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> CreateRequest([FromBody] RequestCreateDto dto)
        {
            var userIdStr = "ba1d8683-14de-4d59-b01c-a9ca9476ee24"; // временно
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            // Проверяем наличие ключа в таблице KeyTypes
            var keyType = await _db.KeyTypes.FirstOrDefaultAsync(k => k.Name == dto.Resource);
            if (keyType == null)
                return NotFound(new { message = $"KeyType '{dto.Resource}' not found" });

            var request = await _requests.CreateRequestAsync(userId, dto.Resource, dto.Reason);
            return Ok(new { request_id = request.id, status = request.status.ToString() });
        }


        /// <summary>
        /// Получить свои заявки
        /// </summary>
        [HttpGet("my")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetMyRequests([FromQuery] string? q)
        {
            var userIdStr = "ba1d8683-14de-4d59-b01c-a9ca9476ee24";
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var list = await _requests.GetRequestsByUserAsync(userId);
            var query = list.AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var pattern = q.ToLower();
                query = query.Where(r =>
                    r.resource.ToLower().Contains(pattern) ||
                    r.reason.ToLower().Contains(pattern)
                );
            }

            return Ok(query.ToList());
        }

        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetAll([FromQuery] string? q, [FromQuery] string? status)
        {
            var all = await _requests.GetAllRequestsAsync(); // получаем IQueryable внутри сервиса лучше
            var query = all.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(r => r.status.ToString() == status);

            if (!string.IsNullOrWhiteSpace(q))
            {
                var pattern = q.ToLower();
                query = query.Where(r =>
                    r.resource.ToLower().Contains(pattern) ||
                    r.reason.ToLower().Contains(pattern)
                );
            }

            return Ok(query.ToList());
        }

        /// <summary>
        /// Одобрить заявку
        /// </summary>
        [HttpPut("{id}/approve")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Approve(Guid id)
        {
            var request = await _requests.UpdateRequestStatusAsync(id, Status.APPROVED);
            if (request is null) return NotFound();

            var credentials = new Dictionary<string, string>
            {
                { "username", $"user_{Guid.NewGuid():N}" },
                { "password", Guid.NewGuid().ToString("N")[..12] }
            };
            await _openBao.SaveSecretAsync(request.resource, credentials, _token);

            var keyType = await _db.KeyTypes.FirstOrDefaultAsync(k => k.Name == request.resource);
            if (keyType != null)
            {
                var issuedKey = new IssuedKey
                {
                    UserId = request.userId,
                    KeyTypeId = keyType.Id,
                    IssuedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };
                _db.IssuedKeys.Add(issuedKey);
                await _db.SaveChangesAsync();
            }

            await _requests.UpdateRequestAsync(request);
            return Ok(request);
        }

        /// <summary>
        /// Отклонить заявку
        /// </summary>
        [HttpPut("{id}/reject")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Reject(Guid id)
        {
            var req = await _requests.UpdateRequestStatusAsync(id, Status.REJECTED);
            return req is null ? NotFound() : Ok(req);
        }
    }

    public class RequestCreateDto
    {
        public string Resource { get; set; } = null!;
        public string Reason { get; set; } = null!;
    }
}

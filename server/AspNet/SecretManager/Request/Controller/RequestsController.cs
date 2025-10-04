using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretManager.Common.Models.UserEntity;
using SecretManager.Keys.Service;
using SecretManager.OpenBao.Services;
using SecretManager.Request.Services;
using System.Security.Claims;

namespace SecretManager.Requests.Controller
{
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        private readonly RequestService _requests;
        private readonly OpenBaoService _openBao;
        private readonly KeysService _keys;
        private readonly string _token;

        public RequestsController(
            RequestService requests,
            OpenBaoService openBao,
            KeysService keys,
            IConfiguration config)
        {
            _requests = requests;
            _openBao = openBao;
            _keys = keys;
            _token = config["OpenBao:Token"] ?? throw new InvalidOperationException("Missing OpenBao token");
        }

        // 📝 Создание заявки
        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> CreateRequest([FromBody] RequestCreateDto dto)
        {
            var userIdStr = User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var request = await _requests.CreateRequestAsync(userId, dto.Resource, dto.Reason);
            return Ok(new
            {
                request_id = request.id,
                status = request.status.ToString()
            });
        }

        // 👤 Получить свои заявки
        [HttpGet("my")]
        //[Authorize]
        public async Task<IActionResult> GetMyRequests()
        {
            var userIdStr = User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var list = await _requests.GetRequestsByUserAsync(userId);
            return Ok(list);
        }

        // 🧾 Все заявки (для админов)
        [HttpGet]
        //[Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAll()
        {
            var all = await _requests.GetAllRequestsAsync();
            return Ok(all);
        }

        // ✅ Одобрить заявку
        [HttpPut("{id}/approve")]
        //[Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Approve(Guid id)
        {
            Common.Models.UserEntity.Request request = await _requests.UpdateRequestStatusAsync(id, Status.APPROVED);
            if (request is null)
                return NotFound();

            // ⚙️ Имитация создания учётных данных
            var credentials = new Dictionary<string, string>
            {
                { "username", $"user_{Guid.NewGuid():N}" },
                { "password", Guid.NewGuid().ToString("N")[..12] }
            };

            // 💾 Сохраняем секрет в OpenBao
            await _openBao.SaveSecretAsync(request.resource, credentials, _token);

            // 🗝 Добавляем запись о выданном ключе (пример — тестовые данные)
            await _keys.AddIssuedKeyAsync(request.userId, 1, DateTime.UtcNow.AddDays(7));

            // 🔁 Обновляем заявку
            await _requests.UpdateRequestAsync(request);

            return Ok(request);
        }

        // ❌ Отклонить заявку
        [HttpPut("{id}/reject")]
        //[Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var req = await _requests.UpdateRequestStatusAsync(id, Status.REJECTED);
            return req is null ? NotFound() : Ok(req);
        }
    }

    // DTO для создания заявки
    public class RequestCreateDto
    {
        public string Resource { get; set; } = null!;
        public string Reason { get; set; } = null!;
    }
}

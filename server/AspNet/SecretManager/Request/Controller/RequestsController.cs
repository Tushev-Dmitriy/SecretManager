using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecretManager.Common.Services;
using System.Security.Claims;
using SecretManager.Common.Models.UserEntity;

namespace SecretManager.Request.Controllers
{
    [ApiController]
    [Route("api/requests")]
    public class RequestsController : ControllerBase
    {
        private readonly RequestService _service;

        public RequestsController(RequestService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateRequest([FromBody] RequestCreateDto dto)
        {
            var userIdStr = User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            if (!Guid.TryParse(userIdStr, out var userId))
                return BadRequest("Invalid user id");

            var request = await _service.CreateRequestAsync(userId, dto.Resource, dto.Reason);
            return Ok(request);
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyRequests()
        {
            var userIdStr = User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            if (!Guid.TryParse(userIdStr, out var userId))
                return BadRequest("Invalid user id");

            var requests = await _service.GetRequestsByUserAsync(userId);
            return Ok(requests);
        }


        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _service.GetAllRequestsAsync();
            return Ok(requests);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ApproveRequest(Guid id)
        {
            var request = await _service.UpdateRequestStatusAsync(id, Status.APPROVED);
            return request == null ? NotFound() : Ok(request);
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> RejectRequest(Guid id)
        {
            var request = await _service.UpdateRequestStatusAsync(id, Status.REJECTED);
            return request == null ? NotFound() : Ok(request);
        }
    }

    // DTO для создания заявки
    public class RequestCreateDto
    {
        public string Resource { get; set; } = null!;
        public string Reason { get; set; } = null!;
    }
}

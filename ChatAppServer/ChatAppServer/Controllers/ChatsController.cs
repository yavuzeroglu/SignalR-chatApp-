
using ChatAppServer.Context;
using ChatAppServer.DTOs;
using ChatAppServer.Hubs;
using ChatAppServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ChatAppServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public sealed class ChatsController(
        AppDbContext context,
        IHubContext<ChatHub> hubContext) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            List<User> users = await context.Users.OrderBy(x => x.Name).ToListAsync();
            return Ok(users);
        }

        [HttpGet]
        public async Task<IActionResult> GetChats(Guid userId, Guid toUserId, CancellationToken cancellationToken)
        {
            List<Chat> chats = await context
                .Chats
                .Where(c =>
                    c.UserId.Equals(userId) && c.ToUserId.Equals(toUserId) ||
                    c.ToUserId.Equals(userId) && c.UserId.Equals(toUserId))
                .OrderBy(x => x.Date)
                .ToListAsync(cancellationToken);

            return Ok(chats);
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(MessageDTO request, CancellationToken cancellationToken)
        {
            Chat chat = new()
            {
                UserId = request.UserId,
                ToUserId = request.ToUserId,
                Message = request.Message,
                Date = DateTime.Now
            };
            string connectionId = ChatHub.Users.First(p => p.Value == chat.ToUserId).Key;

            await hubContext.Clients.Client(connectionId)
                .SendAsync("Messages", chat);

            await context.AddAsync(chat, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return Ok(chat);
        }
    }
}
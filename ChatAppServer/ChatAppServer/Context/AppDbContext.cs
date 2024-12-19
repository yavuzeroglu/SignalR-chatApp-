using ChatAppServer.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatAppServer.Context;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options) : base(options)
    { }

    public DbSet<User> Users{ get; set; }
    public DbSet<Chat> Chats{ get; set; }
}

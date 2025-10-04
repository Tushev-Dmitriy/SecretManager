using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Models.UserEntity;

namespace SecretManager.Common.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; } = null!;
        public DbSet<Models.UserEntity.Request> Request { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.id);
                entity.HasIndex(u => u.username).IsUnique();
                entity.HasIndex(u => u.email).IsUnique();
                entity.Property(u => u.role).HasDefaultValue(Role.USER);

                entity.HasMany<Models.UserEntity.Request>()
                      .WithOne()
                      .HasForeignKey(r => r.userId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Models.UserEntity.Request>(entity =>
            {
                entity.HasKey(r => r.id);
                entity.Property(r => r.status).HasDefaultValue(Status.PENDING);
                entity.Property(r => r.createdAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(r => r.resource).IsRequired();
                entity.Property(r => r.reason).IsRequired();
            });
        }
    }
}

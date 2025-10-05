using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Models;
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
        public DbSet<IssuedKey> IssuedKeys { get; set; } = null!;
        public DbSet<KeyType> KeyTypes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Models.UserEntity.Request>(entity =>
            {
                entity.HasKey(r => r.id);
                entity.Property(r => r.status)
                      .HasConversion<string>()
                      .HasDefaultValue(Status.PENDING);
                entity.Property(r => r.createdAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(r => r.resource).IsRequired();
                entity.Property(r => r.reason).IsRequired();
            });

            modelBuilder.Entity<KeyType>(entity =>
            {
                entity.HasKey(k => k.Id);
                entity.Property(k => k.Name).IsRequired();
                entity.Property(k => k.Category).IsRequired();
            });

            modelBuilder.Entity<IssuedKey>(entity =>
            {
                entity.HasKey(k => k.Id);
                entity.Property(k => k.IssuedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(k => k.ExpiresAt);

                entity.HasOne(k => k.KeyType)
                      .WithMany()
                      .HasForeignKey(k => k.KeyTypeId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}

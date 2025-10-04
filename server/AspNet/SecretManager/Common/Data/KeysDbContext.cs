using Microsoft.EntityFrameworkCore;
using SecretManager.Common.Models;

namespace SecretManager.Common.Data
{
    public class KeysDbContext : DbContext
    {
        public KeysDbContext(DbContextOptions<KeysDbContext> options) : base(options) { }

        public DbSet<IssuedKey> IssuedKeys { get; set; }
        public DbSet<KeyType> KeyTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
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

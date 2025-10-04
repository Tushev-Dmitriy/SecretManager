namespace SecretManager.Common.Models.UserEntity
{
    public enum Role
    {
        USER,
        ADMIN
    }

    public enum Status
    {
        PENDING,
        APPROVED,
        REJECTED
    }

    public class User
    {
        public Guid id { get; set; } = Guid.NewGuid();
        public string username { get; set; } = null!;
        public string email { get; set; } = null!;
        public string passwordHash { get; set; } = null!;
        public Role role { get; set; } = Role.USER;
    }

    public class Request
    {
        public Guid id { get; set; } = Guid.NewGuid();

        public Guid userId { get; set; }
        public string resource { get; set; } = null!;
        public string reason { get; set; } = null!;
        public Status status { get; set; } = Status.PENDING;

        public DateTime createdAt { get; set; } = DateTime.UtcNow;
    }
}

namespace SecretManager.Common
{
    public class UserSecret
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string SecretName { get; set; }
        public DateTime GrantedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
}

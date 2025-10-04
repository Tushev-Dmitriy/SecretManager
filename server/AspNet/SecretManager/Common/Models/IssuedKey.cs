using SecretManager.Common.Models.UserEntity;

namespace SecretManager.Common.Models
{
    public class IssuedKey
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int KeyTypeId { get; set; }
        public KeyType KeyType { get; set; }
        public DateTime IssuedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }

    public enum Category
    {
        MySQL, PostgreSQL, Oracle, MS_SQL_Server, MongoDB,
        REST_endpoints, GraphQL_APIs, SOAP_services,
        SMB_shares, NFS_mounts, FTP_SFTP_servers,
        Zabbix, Nagios, Prometheus, Jenkins, Docker_Registry
    }
    
    public class KeyType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
    }
}

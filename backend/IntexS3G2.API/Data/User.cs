using System.ComponentModel.DataAnnotations;
namespace IntexS3G2.API.Data
{
    public class User
    {
        [Key]
        public byte UserId { get; set; }  // assuming tinyint maps to byte

        public string? Name { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public int? Age { get; set; }

        public string? Gender { get; set; }

        // Streaming service subscriptions
        public bool Netflix { get; set; }
        public bool Amazon_Prime { get; set; }
        public bool Disney { get; set; }
        public bool Paramount { get; set; }
        public bool Max { get; set; }
        public bool Hulu { get; set; }
        public bool Apple_TV { get; set; }
        public bool Peacock { get; set; }

        // Location
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip { get; set; }
    }
}

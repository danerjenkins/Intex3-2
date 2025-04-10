using System.ComponentModel.DataAnnotations;
namespace IntexS3G2.API.Data
{
    public class User
    {
        [Key]
        public string user_id { get; set; } 

        public string? name { get; set; }

        [Phone]
        public string? phone { get; set; }

        [EmailAddress]
        public string? email { get; set; }

        public int? age { get; set; }

        public string? gender { get; set; }

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
        public string? city { get; set; }
        public string? state { get; set; }
        public int? zip { get; set; }
    }
}

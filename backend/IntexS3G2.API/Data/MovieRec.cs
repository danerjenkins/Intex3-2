using System.ComponentModel.DataAnnotations;

namespace IntexS3G2.API.Data;

public class MovieRec
{
    [Key]
    public string show_id { get; set; }
    public string recommended_show_ids {get; set;}
}
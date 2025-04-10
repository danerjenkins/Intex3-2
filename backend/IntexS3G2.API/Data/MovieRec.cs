using System.ComponentModel.DataAnnotations;

namespace IntexS3G2.API.Data;

public class MovieRec
{
    [Key]
    public string show_id { get; set; } = string.Empty;
    public string recommended_show_ids {get; set;} = string.Empty;
}
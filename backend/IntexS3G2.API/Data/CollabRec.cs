using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace IntexS3G2.API.Data;
[Table("collaborative_recommendations")]
public class CollabRec
{
    [Key]
    [Column("If you watched")]
    public string IfYouWatched { get; set; } = string.Empty;

    [Column("Recommendation 1")]
    public string r1 { get; set; } = string.Empty;

    [Column("Recommendation 2")]
    public string r2 { get; set; } = string.Empty;

    [Column("Recommendation 3")]
    public string r3 { get; set; } = string.Empty;

    [Column("Recommendation 4")]
    public string r4 { get; set; } = string.Empty;

    [Column("Recommendation 5")]
    public string r5 { get; set; } = string.Empty;

    [Column("Recommendation 6")]
    public string r6 { get; set; } = string.Empty;

    [Column("Recommendation 7")]
    public string r7 { get; set; } = string.Empty;

    [Column("Recommendation 8")]
    public string r8 { get; set; } = string.Empty;

    [Column("Recommendation 9")]
    public string r9 { get; set; } = string.Empty;

    [Column("Recommendation 10")]
    public string r10 { get; set; } = string.Empty;

    [Column("Recommendation 11")]
    public string r11 { get; set; } = string.Empty;

    [Column("Recommendation 12")]
    public string r12 { get; set; } = string.Empty;

    [Column("Recommendation 13")]
    public string r13 { get; set; } = string.Empty;

    [Column("Recommendation 14")]
    public string r14 { get; set; } = string.Empty;

    [Column("Recommendation 15")]
    public string r15 { get; set; } = string.Empty;
}
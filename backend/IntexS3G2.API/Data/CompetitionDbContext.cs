using Microsoft.EntityFrameworkCore;

namespace IntexS3G2.API.Data;

public class CompetitionDbContext: DbContext
{
    public CompetitionDbContext(DbContextOptions<CompetitionDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Rootbeer> Rootbeers { get; set; }
}
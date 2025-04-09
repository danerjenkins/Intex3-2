using Microsoft.EntityFrameworkCore;

namespace IntexS3G2.API.Data;

public class ContentDbContext : DbContext
{
    public ContentDbContext(DbContextOptions<ContentDbContext> options) 
        : base(options) {}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MovieRec>().ToTable("movie_recommendations");
        
        base.OnModelCreating(modelBuilder);
    }
    
    public DbSet<MovieRec> MovieRecs { get; set; } 
}
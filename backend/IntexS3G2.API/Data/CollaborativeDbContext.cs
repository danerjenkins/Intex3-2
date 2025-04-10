using Microsoft.EntityFrameworkCore;

namespace IntexS3G2.API.Data;

public class CollaborativeDbContext : DbContext
{
    public CollaborativeDbContext(DbContextOptions<CollaborativeDbContext> options) 
        : base(options) {}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CollabRec>().ToTable("collaborative_recommendations");
        
        base.OnModelCreating(modelBuilder);
    }
    
    public DbSet<CollabRec> CollabRecs { get; set; } 
}
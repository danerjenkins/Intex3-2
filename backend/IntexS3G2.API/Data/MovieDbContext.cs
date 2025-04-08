using Microsoft.EntityFrameworkCore;

namespace IntexS3G2.API.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options)
            : base(options) {}
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MoviesRating>()
                .HasKey(r => new { r.user_id, r.show_id });
            
            modelBuilder.Entity<Title>().ToTable("movies_titles");
            modelBuilder.Entity<User>().ToTable("movies_users");
            modelBuilder.Entity<MoviesRating>().ToTable("movies_ratings");
            

            base.OnModelCreating(modelBuilder);
        }
        public DbSet<Title> Titles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MoviesRating> Ratings { get; set; }
    }
}
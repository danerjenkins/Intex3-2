using Microsoft.EntityFrameworkCore;

namespace IntexS3G2.API.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options)
            : base(options) {}

        public DbSet<Title> Titles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MoviesRating> Ratings { get; set; }
    }
}
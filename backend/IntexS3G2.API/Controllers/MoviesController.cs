using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using IntexS3G2.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace IntexS3G2.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class MoviesController : ControllerBase
    {
        private MovieDbContext _movieContext;
        private ContentDbContext _contentContext;

        public MoviesController(MovieDbContext temp, ContentDbContext content)
        {
            _movieContext = temp;
            _contentContext = content;
        }

        [HttpGet("GetAdminMovieData")]
        public IActionResult GetAdminMovieData(int pageNumber = 1, int pageSize =10, [FromQuery] List<string>? genres = null, [FromQuery] List<string>? ratings = null)
        {
            var query = _movieContext.Titles.AsQueryable();

            if (ratings != null && ratings.Any())
            {
                query = query.Where(r => ratings.Contains(r.rating));
            }
            
            if (genres != null && genres.Any())
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Genres: {string.Join(", ", genres)}");
                Console.ResetColor();

                // Move to memory before Split
                query = query
                    .AsEnumerable()
                    .Where(m =>
                        m.Genre != null &&
                        m.Genre
                            .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
                            .Any(g => genres.Contains(g))
                    )
                    .AsQueryable(); // convert back if you want to keep chaining
            }
            
            var results = query
                .Select(m => new
                {
                    m.show_id,
                    m.type,
                    m.title,
                    m.director,
                    m.cast,
                    m.country,
                    m.release_year,
                    m.rating,
                    m.duration,
                    m.description,
                    m.Genre
                })
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            var totalNumberItems = query.Count();
            
            var returnTitles = new
            {
                movies = results,
                totalNumberItems
            };

            return Ok(returnTitles);
        }

        [HttpGet("GetMovieFromId")]
        public IActionResult GetMovieFromId(string showId)
        {
            var movie = _movieContext.Titles
                .Where(m => m.show_id == showId)
                .Select(m => new
                {
                    m.show_id,
                    m.type,
                    m.title,
                    m.director,
                    m.cast,
                    m.country,
                    m.release_year,
                    m.rating,
                    m.duration,
                    m.description,
                    m.Genre
                })
                .FirstOrDefault();
            
            if (movie == null)
                return NotFound();
            
            return Ok(movie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult UpdateMovie(string showId, [FromBody] Title updatedMovie)
        {
            try
            {
            if (updatedMovie == null)
            {
                return BadRequest(new { message = "Invalid movie data provided." });
            }

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine($"*** Received genre: {updatedMovie.Genre} ***");
            Console.ResetColor();

            var existingMovie = _movieContext.Titles.Find(showId);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found." });
            }

            existingMovie.title = updatedMovie.title;
            existingMovie.type = updatedMovie.type;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;
            existingMovie.Genre = updatedMovie.Genre;

            _movieContext.Titles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
            }
            catch (DbUpdateException dbEx)
            {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Database update error: {dbEx.Message}");
            Console.ResetColor();
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the movie in the database." });
            }
            catch (Exception ex)
            {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"Unexpected error: {ex.Message}");
            Console.ResetColor();
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred." });
            }
        }

        [HttpPost("CreateMovie")]
        [Authorize(Roles = "Administrator")]
        public IActionResult CreateMovie([FromBody] Title movieToAdd)
        {
            _movieContext.Titles.Add(movieToAdd);
            _movieContext.SaveChanges();
            return Ok(movieToAdd);
        }
        
        [HttpDelete("/DeleteMovie/{showId}")]
        [Authorize(Roles = "Administrator")]
        public IActionResult DeleteMovie(string showId)
        {
            var movie = _movieContext.Titles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found." });
            }
        
            _movieContext.Titles.Remove(movie);
            _movieContext.SaveChanges();
        
            return NoContent();
        }

        [HttpGet("/GetUserRatedMovies")]
        public IActionResult GetUserRatedMovies(int userId)
        {
            var query = _movieContext.Ratings
                .Where(m => m.user_id == userId)
                .OrderByDescending(m => m.rating)
                .Take(20)
                .ToList();
            
            return Ok(query);
        }

        [HttpPost("RegisterUser")]
        public IActionResult RegisterUser([FromBody] User userToAdd)
        {
            _movieContext.Users.Add(userToAdd);
            _movieContext.SaveChanges();
            
            return Ok(userToAdd);
        }

        [HttpGet("ContentRecommendations/{showId}")]
        public IActionResult ContentRecommendations(string showId)
        {
            var query = _contentContext.MovieRecs.Find(showId);

            if (query == null || string.IsNullOrWhiteSpace(query.recommended_show_ids))
            {
                return NotFound();
            }

            var showIdList = query.recommended_show_ids
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList();
            
            var recommendedMovies = _movieContext.Titles
                .Where(m => showIdList.Contains(m.show_id))
                .Select(m => new
                {
                    m.show_id,
                    m.title
                })
                .ToList();

            return Ok(recommendedMovies);
            
        }
    }
}
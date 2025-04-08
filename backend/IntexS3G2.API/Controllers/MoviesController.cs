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
    public class MoviesController : ControllerBase
    {
        private MovieDbContext _movieContext;

        public MoviesController(MovieDbContext temp)
        {
            _movieContext = temp;
        }

        [HttpGet("GetAdminMovieData")]
        public IActionResult GetAdminMovieData(int pageNumber = 1, [FromQuery] List<string>? genres = null, [FromQuery] List<string>? ratings = null)
        {
            int pageSize = 10;
            var query = _movieContext.Titles.AsQueryable();

            if (ratings != null && ratings.Any())
            {
                query = query.Where(r => ratings.Contains(r.rating));
            }
            
            if (genres != null && genres.Any())
            {
                query = query.Where(m =>
                    genres.Any(g =>
                        m.Genre != null &&
                        m.Genre.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).Contains(g)
                    )
                );
            }

            var totalNumberItems = query.Count();
            var results = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

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
            var query = _movieContext.Titles.AsQueryable();

            query = query.Where(m => m.show_id == showId);
            
            return Ok(query);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] Title updatedMovie)
        {    
            var existingMovie = _movieContext.Titles.Find(showId);
            
            if (existingMovie == null)
            {
                return NotFound(new { message = "Book not found." });
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

        [HttpPost("CreateMovie")]
        public IActionResult CreateMovie([FromBody] Title movieToAdd)
        {
            _movieContext.Titles.Add(movieToAdd);
            _movieContext.SaveChanges();
            return Ok(movieToAdd);
        }
        
        [HttpDelete("/DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(int showId)
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
        
    }
}
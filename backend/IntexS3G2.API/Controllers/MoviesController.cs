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
        private MovieDbContext _moviesContext;

        public MoviesController(MovieDbContext temp)
        {
            _moviesContext = temp;
        }

        [HttpGet("GetAdminMovieData")]
        public IActionResult GetMovieTitles(int pageNumber = 1, [FromQuery] List<string>? genres = null, [FromQuery] List<string>? ratings = null)
        {
            int pageSize = 10;
            var query = _moviesContext.MoviesTitles.AsQueryable();

            if (ratings != null && ratings.Any())
            {
                query = query.Where(r => ratings.Contains(r.Rating) );
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
                totalNumberItems = totalNumberItems
            };

            return Ok(returnTitles);
        }

        [HttpGet("GetMovieFromId")]
        public IActionResult GetMovieInfo(string showId)
        {
            var query = _moviesContext.MoviesTitles.AsQueryable();

            query = query.Where(m => m.ShowId == showId);
            
            return Ok(query);
        }
        
        
    }
}
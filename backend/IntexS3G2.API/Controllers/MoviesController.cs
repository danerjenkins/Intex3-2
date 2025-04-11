using System.Linq.Expressions;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
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
        private CollaborativeDbContext _collaborativeContext;

        public MoviesController(MovieDbContext temp, ContentDbContext content, CollaborativeDbContext collab)
        {
            _movieContext = temp;
            _contentContext = content;
            _collaborativeContext = collab;
        }

        [HttpGet("GetAdminMovieData")]
        public IActionResult GetAdminMovieData(int pageNumber = 1, int pageSize = 10, [FromQuery] List<string>? genres = null, [FromQuery] List<string>? ratings = null)
        {
            var query = _movieContext.Titles.AsQueryable();

            if (ratings != null && ratings.Any())
            {
                query = query.Where(r => ratings.Contains(r.rating));
            }

            if (genres != null && genres.Any())
            {

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
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while updating the movie in the database." });
            }
            catch (Exception ex)
            {
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

        [HttpGet("GetAverageMovieRating/{show_id}")]
        public IActionResult GetAverageMovieRating(string show_id)
        {
            decimal average = 0; // Changed type to decimal
            var query = _movieContext.Ratings
                .Where(m => m.show_id == show_id)
                .Select(m => m.rating).ToList();

            if (query.Count > 0)
            {
                average = Math.Round((decimal)query.Sum() / query.Count, 2); // Corrected rounding logic
            }

            return Ok(average); // Returns the rounded decimal
        }

        [HttpGet("GetCountMovieRating/{show_id}")]
        public IActionResult GetCountMovieRating(string show_id)
        {
            var query = _movieContext.Ratings
                .Where(m => m.show_id == show_id)
                .Select(m => m.rating).Count();

            return Ok(query);
        }

        [HttpPost("AddRating")]
        public IActionResult AddRating([FromBody] MoviesRating ratingToAdd)
        {
            _movieContext.Ratings.Add(ratingToAdd);
            _movieContext.SaveChanges();

            return Ok(ratingToAdd);
        }



        [HttpPost("RegisterUser")]
        [AllowAnonymous]
        public IActionResult RegisterUser([FromBody] User userToAdd)
        {
            // Safeguard against missing user_id
            var maxUserId = _movieContext.Users.Any() ? _movieContext.Users.Max(u => u.user_id) : 0;
            userToAdd.user_id = maxUserId + 1;
            
            _movieContext.Users.Add(userToAdd);
            _movieContext.SaveChanges();
            return Ok(userToAdd);
        }

        [HttpGet("ContentRecommendations/{showId}")]
        public IActionResult ContentRecommendations(string showId)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(showId))
                {
                    return BadRequest("Show ID must not be null, empty, or whitespace.");
                }

                // Attempt to find recommendation entry
                var query = _contentContext.MovieRecs.Find(showId);
                if (query == null)
                {
                    return NotFound($"No recommendations found for Show ID '{showId}'.");
                }

                // Validate recommended IDs
                if (string.IsNullOrWhiteSpace(query.recommended_show_ids))
                {
                    return NotFound($"No recommended show IDs available for Show ID '{showId}'.");
                }

                // Parse the recommended show IDs
                var showIdList = query.recommended_show_ids
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();

                if (!showIdList.Any())
                {
                    return NotFound($"Recommended show ID list for '{showId}' is empty after parsing.");
                }

                // Query movies based on the list of IDs
                var recommendedMovies = _movieContext.Titles
                    .Where(m => showIdList.Contains(m.show_id))
                    .Select(m => new
                    {
                        m.show_id,
                        m.title,
                        m.Genre
                    })
                    .ToList();

                if (recommendedMovies.Count == 0)
                {
                    return NotFound($"No matching titles found for recommended show IDs of '{showId}'.");
                }

                return Ok(recommendedMovies);
            }
            catch (Exception ex)
            {
                // Log the exception if logging is set up
                // _logger.LogError(ex, "Error retrieving content recommendations for Show ID {showId}", showId);
                
                return StatusCode(500, $"An unexpected error occurred while retrieving recommendations for '{showId}': {ex.Message}");
            }
        }

        [HttpPost("GetRecommendationFromAzure")]
        public async Task<IActionResult> GetRecommendationFromAzure([FromBody] int userId)
        {
            var data = new
            {
                Inputs = new
                {
                    WebServiceInput2 = new[]
                    {
                        new { user_id = userId }
                    }
                }
            };

            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = Environment.GetEnvironmentVariable("AZURE_URL");
            var apiKey = Environment.GetEnvironmentVariable("AZURE_API_KEY"); // Store in secrets or config ideally

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            try
            {
                var response = await client.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(result);
                var innerObject = doc
                    .RootElement
                    .GetProperty("Results")
                    .GetProperty("WebServiceOutput0")[0];

                // Extract show_ids (recommended item values)
                var showIds = innerObject.EnumerateObject()
                    .Where(p => p.Name.StartsWith("Recommended Item"))
                    .Select(p => p.Value.GetString())
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .ToList();

                // Fetch titles from the database
                var recommendedMovies = _movieContext.Titles
                    .Where(t => showIds.Contains(t.show_id))
                    .Select(t => new
                    {
                        t.show_id,
                        t.title
                    })
                    .ToList();

                return Ok(recommendedMovies);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Azure ML call failed.", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Unexpected error occurred.", error = ex.Message });
            }

        }

            [HttpGet("CollaborativeRecommendations/{showId}")]
            public IActionResult CollaborativeRecommendations(string showId)
            {
                try
                {
                    // Validate input
                    if (string.IsNullOrWhiteSpace(showId))
                    {
                        return BadRequest("Show ID must not be null, empty, or whitespace.");
                    }

                    // Attempt to find the collaborative recommendation record
                    var query = _collaborativeContext.CollabRecs
                        .FirstOrDefault(r => r.IfYouWatched == showId);

                    if (query == null)
                    {
                        return NotFound($"No collaborative recommendations found for Show ID '{showId}'.");
                    }

                    // Validate that at least one recommendation exists
                    if (string.IsNullOrWhiteSpace(query.r1))
                    {
                        return NotFound($"No recommended show IDs available for Show ID '{showId}'.");
                    }

                    // Collect all non-null recommendation fields (r1 through r15)
                    var showIdList = new List<string>();

                    var recommendations = new[] 
                    {
                        query.r1, query.r2, query.r3, query.r4, query.r5,
                        query.r6, query.r7, query.r8, query.r9, query.r10,
                        query.r11, query.r12, query.r13, query.r14, query.r15
                    };

                    showIdList.AddRange(recommendations
                        .Where(id => !string.IsNullOrWhiteSpace(id))
                        .Select(id => id.Trim()));

                    if (!showIdList.Any())
                    {
                        return NotFound($"All recommendation fields for Show ID '{showId}' are empty.");
                    }

                    // Query the movie titles that match the recommended show IDs
                    var recommendedMovies = _movieContext.Titles
                        .Where(m => showIdList.Contains(m.show_id))
                        .Select(m => new
                        {
                            m.show_id,
                            m.title
                        })
                        .ToList();

                    if (recommendedMovies.Count == 0)
                    {
                        return NotFound($"No matching movie titles found for the recommended show IDs of '{showId}'.");
                    }

                    return Ok(recommendedMovies);
                }
                catch (Exception ex)
                {
                    // Log exception if needed
                    // _logger.LogError(ex, "Error retrieving collaborative recommendations for Show ID {showId}", showId);

                    return StatusCode(500, $"An unexpected error occurred while retrieving recommendations for '{showId}': {ex.Message}");
                }
            }

            [HttpGet("GetTopRatedMovies")]
            [AllowAnonymous] // Will be used on the main page so needs to be anonymous
            public IActionResult GetTopRatedMovies()
            {
                // Join Ratings with Titles on show_id and calculate average ratings
                var topMovies = _movieContext.Ratings
                    .GroupBy(r => r.show_id)
                    .Select(g => new
                    {
                        ShowId = g.Key,
                        AverageRating = g.Average(r => r.rating)
                    })
                    .OrderByDescending(m => m.AverageRating)
                    .Take(10) // top 10 highest-rated
                    .Join(_movieContext.Titles,
                        r => r.ShowId,
                        t => t.show_id,
                        (r, t) => new
                        {
                            t.show_id,
                            t.title
                        })
                    .ToList();

                return Ok(topMovies);
            }
        }
    }


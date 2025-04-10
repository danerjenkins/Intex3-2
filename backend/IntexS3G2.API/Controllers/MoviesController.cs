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

        [HttpGet("GetAverageMovieRating/{show_id}")]
        public IActionResult GetAverageMovieRating(string show_id)
        {
            int average = 0;
            var query = _movieContext.Ratings
                .Where(m => m.show_id == show_id)
                .Select(m => m.rating).ToList();
            if (query.Count > 0)
            {
                average = (query.Sum() / query.Count);
            }


            return Ok(average);
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
                    m.title,
                    m.Genre
                })
                .ToList();

            return Ok(recommendedMovies);

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
                // Find the collaborative record based on the show id.
                var query = _collaborativeContext.CollabRecs
                    .FirstOrDefault(r => r.IfYouWatched == showId);

                // If the query is null or there's no recommended show id in r1, return NotFound.
                if (query == null || string.IsNullOrWhiteSpace(query.r1))
                {
                    return NotFound();
                }

                // Build the list of show IDs from each of the r1 through r15 columns.
                var showIdList = new List<string>();

                if (!string.IsNullOrWhiteSpace(query.r1)) showIdList.Add(query.r1);
                if (!string.IsNullOrWhiteSpace(query.r2)) showIdList.Add(query.r2);
                if (!string.IsNullOrWhiteSpace(query.r3)) showIdList.Add(query.r3);
                if (!string.IsNullOrWhiteSpace(query.r4)) showIdList.Add(query.r4);
                if (!string.IsNullOrWhiteSpace(query.r5)) showIdList.Add(query.r5);
                if (!string.IsNullOrWhiteSpace(query.r6)) showIdList.Add(query.r6);
                if (!string.IsNullOrWhiteSpace(query.r7)) showIdList.Add(query.r7);
                if (!string.IsNullOrWhiteSpace(query.r8)) showIdList.Add(query.r8);
                if (!string.IsNullOrWhiteSpace(query.r9)) showIdList.Add(query.r9);
                if (!string.IsNullOrWhiteSpace(query.r10)) showIdList.Add(query.r10);
                if (!string.IsNullOrWhiteSpace(query.r11)) showIdList.Add(query.r11);
                if (!string.IsNullOrWhiteSpace(query.r12)) showIdList.Add(query.r12);
                if (!string.IsNullOrWhiteSpace(query.r13)) showIdList.Add(query.r13);
                if (!string.IsNullOrWhiteSpace(query.r14)) showIdList.Add(query.r14);
                if (!string.IsNullOrWhiteSpace(query.r15)) showIdList.Add(query.r15);

                // Query the movie titles for records that match the recommended show IDs.
                var recommendedMovies = _movieContext.Titles
                    .Where(m => showIdList.Contains(m.show_id))
                    .Select(m => new
                    {
                        m.show_id,
                        m.title
                    })
                    .ToList();

                // Return the list of recommended movies.
                return Ok(recommendedMovies);
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


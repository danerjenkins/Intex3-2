using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntexS3G2.API.Migrations.MovieDb
{
    /// <inheritdoc />
    public partial class AutoGenerateUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "movies_ratings",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false),
                    show_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    rating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movies_ratings", x => new { x.user_id, x.show_id });
                });

            migrationBuilder.CreateTable(
                name: "movies_titles",
                columns: table => new
                {
                    show_id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    director = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cast = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    release_year = table.Column<int>(type: "int", nullable: true),
                    rating = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    duration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Action = table.Column<bool>(type: "bit", nullable: false),
                    Adventure = table.Column<bool>(type: "bit", nullable: false),
                    Anime_Series_International_TV_Shows = table.Column<bool>(type: "bit", nullable: false),
                    British_TV_Shows_Docuseries_International_TV_Shows = table.Column<bool>(type: "bit", nullable: false),
                    Children = table.Column<bool>(type: "bit", nullable: false),
                    Comedies = table.Column<bool>(type: "bit", nullable: false),
                    Comedies_Dramas_International_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Comedies_International_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Comedies_Romantic_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Crime_TV_Shows_Docuseries = table.Column<bool>(type: "bit", nullable: false),
                    Documentaries = table.Column<bool>(type: "bit", nullable: false),
                    Documentaries_International_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Docuseries = table.Column<bool>(type: "bit", nullable: false),
                    Dramas = table.Column<bool>(type: "bit", nullable: false),
                    Dramas_International_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Dramas_Romantic_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Family_Movies = table.Column<bool>(type: "bit", nullable: false),
                    Fantasy = table.Column<bool>(type: "bit", nullable: false),
                    Horror_Movies = table.Column<bool>(type: "bit", nullable: false),
                    International_Movies_Thrillers = table.Column<bool>(type: "bit", nullable: false),
                    International_TV_Shows_Romantic_TV_Shows_TV_Dramas = table.Column<bool>(type: "bit", nullable: false),
                    Kids_TV = table.Column<bool>(type: "bit", nullable: false),
                    Language_TV_Shows = table.Column<bool>(type: "bit", nullable: false),
                    Musicals = table.Column<bool>(type: "bit", nullable: false),
                    Nature_TV = table.Column<bool>(type: "bit", nullable: false),
                    Reality_TV = table.Column<bool>(type: "bit", nullable: false),
                    Spirituality = table.Column<bool>(type: "bit", nullable: false),
                    TV_Action = table.Column<bool>(type: "bit", nullable: false),
                    TV_Comedies = table.Column<bool>(type: "bit", nullable: false),
                    TV_Dramas = table.Column<bool>(type: "bit", nullable: false),
                    Talk_Shows_TV_Comedies = table.Column<bool>(type: "bit", nullable: false),
                    Thrillers = table.Column<bool>(type: "bit", nullable: false),
                    Genre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movies_titles", x => x.show_id);
                });

            migrationBuilder.CreateTable(
                name: "movies_users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    age = table.Column<int>(type: "int", nullable: true),
                    gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Netflix = table.Column<bool>(type: "bit", nullable: true),
                    Amazon_Prime = table.Column<bool>(type: "bit", nullable: true),
                    Disney = table.Column<bool>(type: "bit", nullable: true),
                    Paramount = table.Column<bool>(type: "bit", nullable: true),
                    Max = table.Column<bool>(type: "bit", nullable: true),
                    Hulu = table.Column<bool>(type: "bit", nullable: true),
                    Apple_TV = table.Column<bool>(type: "bit", nullable: true),
                    Peacock = table.Column<bool>(type: "bit", nullable: true),
                    city = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    state = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    zip = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movies_users", x => x.user_id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "movies_ratings");

            migrationBuilder.DropTable(
                name: "movies_titles");

            migrationBuilder.DropTable(
                name: "movies_users");
        }
    }
}

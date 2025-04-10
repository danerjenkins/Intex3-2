using System.ComponentModel.DataAnnotations;
namespace IntexS3G2.API.Data
{
    public class Title
    {
        [Key]
        public string show_id { get; set; } = string.Empty;

        public string? type { get; set; }
        public string? title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public int? release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string? description { get; set; }

        // Genre/Category Booleans
        public bool Action { get; set; }
        public bool Adventure { get; set; }
        public bool Anime_Series_International_TV_Shows { get; set; }
        public bool British_TV_Shows_Docuseries_International_TV_Shows { get; set; }
        public bool Children { get; set; }
        public bool Comedies { get; set; }
        public bool Comedies_Dramas_International_Movies { get; set; }
        public bool Comedies_International_Movies { get; set; }
        public bool Comedies_Romantic_Movies { get; set; }
        public bool Crime_TV_Shows_Docuseries { get; set; }
        public bool Documentaries { get; set; }
        public bool Documentaries_International_Movies { get; set; }
        public bool Docuseries { get; set; }
        public bool Dramas { get; set; }
        public bool Dramas_International_Movies { get; set; }
        public bool Dramas_Romantic_Movies { get; set; }
        public bool Family_Movies { get; set; }
        public bool Fantasy { get; set; }
        public bool Horror_Movies { get; set; }
        public bool International_Movies_Thrillers { get; set; }
        public bool International_TV_Shows_Romantic_TV_Shows_TV_Dramas { get; set; }
        public bool Kids_TV { get; set; }
        public bool Language_TV_Shows { get; set; }
        public bool Musicals { get; set; }
        public bool Nature_TV { get; set; }
        public bool Reality_TV { get; set; }
        public bool Spirituality { get; set; }
        public bool TV_Action { get; set; }
        public bool TV_Comedies { get; set; }
        public bool TV_Dramas { get; set; }
        public bool Talk_Shows_TV_Comedies { get; set; }
        public bool Thrillers { get; set; }

        public string Genre { get; set; } = string.Empty;
    }
}

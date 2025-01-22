using System.Text.Json.Serialization;

namespace Edwinschoice.Server.Models
{
    public class Endings
    {
        public int EndingsId { get; set; }
        public required string EndingName { get; set; }
        public required string EndingDescription { get; set; }
        public required string EndingImagePath { get; set; }
        public int LocationsId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Locations? Locations { get; set; }

    }
}

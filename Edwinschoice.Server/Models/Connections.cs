using System.ComponentModel.DataAnnotations;

namespace Edwinschoice.Server.Models
{
    public class Connections
    {
        
        public int ConnectionsId { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public int? LocationsId { get; set; }
        public string? ConnectionText { get; set; }
        public int? ItemId { get; set; }
        public int? BattlesId { get; set; }
        public Locations? Locations { get; set; }
        public Locations? To { get; set; }
        public Locations? From { get; set; }

        public Battles? Battle { get; set; }
        public Items? Item { get; set; }
    }
}

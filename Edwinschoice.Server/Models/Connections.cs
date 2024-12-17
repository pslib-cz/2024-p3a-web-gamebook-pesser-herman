using System.ComponentModel.DataAnnotations;

namespace Edwinschoice.Server.Models
{
    public class Connections
    {
        
        public int ConnectionsId { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public int? LocationId { get; set; } 

        public int? BattlesId { get; set; }
        public Locations? Location { get; set; }
        public Battles? Battle { get; set; }
    }
}

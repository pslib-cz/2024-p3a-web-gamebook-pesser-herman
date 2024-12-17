namespace Edwinschoice.Server.Models
{
    public class Connections
    {
        public int ConnectionId { get; set; }
        public int FromId { get; set; }
        public int ToId { get; set; }
        public int? LocationId { get; set; } 

        public int? BattleId { get; set; }
        public Locations? Location { get; set; }
        public Battles? Battle { get; set; }
    }
}

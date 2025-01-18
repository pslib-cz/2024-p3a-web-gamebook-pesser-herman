using System.ComponentModel.DataAnnotations;

namespace Edwinschoice.Server.Models
{
    public class Connections
    {

        public int ConnectionsId { get; set; }
        public int? FromId { get; set; }
        public int? ToId { get; set; }
        public int? FromBattleId { get; set; }
        public int? ToBattleId { get; set; }
        public string? ConnectionText { get; set; }
        public int? ItemId { get; set; }
        public Locations? To { get; set; }
        public Locations? From { get; set; }
        public Battles? ToBattle { get; set; }
        public Battles? FromBattle { get; set; }
        public Items? Item { get; set; }
    }
}

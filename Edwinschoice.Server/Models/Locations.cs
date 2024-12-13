using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Edwinschoice.Server.Models
{
    public class Locations : Items
    {
        public int LocationId { get; set; }
        public required string LocationName { get; set; }
        public required string Description { get; set; }
        public required byte[] BackgroundImage { get; set; }
        public bool Reobtainable { get; set; }
        public Items? ItemId { get; set; }

    }
}

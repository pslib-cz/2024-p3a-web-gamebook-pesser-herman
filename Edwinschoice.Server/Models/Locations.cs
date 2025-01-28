using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Edwinschoice.Server.Models
{
    public class Locations
    {
        public int LocationsId { get; set; }
        public required string LocationName { get; set; }
        public required string LocationDescription { get; set; }
        public required string LocationImagePath { get; set; }
        public bool? ItemReobtainable { get; set; }
        public int? ItemId { get; set; }
        public Items? Item { get; set; }

    }
}

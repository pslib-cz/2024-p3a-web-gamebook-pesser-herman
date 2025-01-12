using System.ComponentModel.DataAnnotations;

namespace Edwinschoice.Server.Models
{
    public class Items
    {
        public int ItemsId { get; set; }
        public required string ItemName { get; set; }
        public int? Health { get; set; }
        public int? Attack {  get; set; }
        public int? Defense { get; set; }
        public bool isConsumable { get; set; }
        public bool forStory { get; set; }
        public required string ItemImagePath { get; set; }
    }
}


using System.ComponentModel.DataAnnotations;
namespace Edwinschoice.Server.Models
{
    public class Battles
    {

       
        public int BattlesId { get; set; }
        public required string EnemyName { get; set; }
        public required int Health { get; set; }
        public required int Defense { get; set; }
        public required int Attack { get; set; }
        public required string BattleImagePath { get; set; }

    }
}

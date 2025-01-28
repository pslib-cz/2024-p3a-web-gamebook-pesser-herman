
using System.ComponentModel.DataAnnotations;
namespace Edwinschoice.Server.Models
{
    public class Battles
    {

       
        public int BattlesId { get; set; }
        public required string EnemyName { get; set; }
        public required int EnemyHealth { get; set; }
        public required int EnemyDefense { get; set; }
        public required int EnemyAttack { get; set; }
        public required string BattleImagePath { get; set; }

    }
}

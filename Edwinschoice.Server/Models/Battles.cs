﻿namespace Edwinschoice.Server.Models
{
    public class Battles
    {
        public int BattleId { get; set; }
        public required string EnemyName { get; set; }
        public required int Health { get; set; }
        public required int Defense { get; set; }
        public required int Attack { get; set; }
        public required byte[] BackroundImage { get; set; }

    }
}

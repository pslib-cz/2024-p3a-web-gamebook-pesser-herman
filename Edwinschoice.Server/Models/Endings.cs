﻿namespace Edwinschoice.Server.Models
{
    public class Endings
    {
        public int EndingId { get; set; }
        public required string EndingName { get; set; }
        public required string EndingDescription { get; set; }
        public required byte[] EndingImage { get; set; }
    }
}

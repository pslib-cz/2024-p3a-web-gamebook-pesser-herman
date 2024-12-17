using Edwinschoice.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Edwinschoice.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Locations> Locations { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<Battles> Battles { get; set; }
        public DbSet<Endings> Endings { get; set; }
        public DbSet<Connections> Connections { get; set; }

    }
}

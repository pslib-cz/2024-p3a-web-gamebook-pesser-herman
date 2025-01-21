using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Edwinschoice.Server.Data;
using Edwinschoice.Server.Models;

namespace Edwinschoice.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BattlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _imageDirectory = Path.Combine("wwwroot", "battless");

        public BattlesController(ApplicationDbContext context)
        {
            _context = context;

            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }
        }

        [HttpGet("{id}/connections")]
        public IActionResult GetConnectedLocations(int id)
        {
            var connections = _context.Connections
                .Where(c => c.FromBattleId == id)
                .Include(c => c.ToBattle)
                .Select(c => new
                {
                    c.ToBattleId,
                    c.ToBattle.EnemyName,
                    c.ToBattle.Health,
                    c.ToBattle.Defense,
                    c.ToBattle.Attack,
                    c.ConnectionText
                })
                .ToList();

            return Ok(connections);
        }

        // GET: api/Battles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Battles>>> GetBattles()
        {
            return await _context.Battles.ToListAsync();
        }

        // GET: api/Battles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Battles>> GetBattles(int id)
        {
            try
            {
                Console.WriteLine($"Fetching battle ID: {id}");

                var battle = await _context.Battles.FindAsync(id);

                if (battle == null)
                {
                    Console.WriteLine($"Battle with ID {id} not found");
                    return NotFound($"Battle with ID {id} not found");
                }

                return Ok(battle);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching battle {id}: {ex}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("{id}/image")]
        public IActionResult GetBattleImage(int id)
        {
            var battles = _context.Battles.Find(id);

            if (battles == null || string.IsNullOrEmpty(battles.BattleImagePath))
            {
                return NotFound();
            }

            var imagePath = Path.Combine(_imageDirectory, battles.BattleImagePath);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);
            return File(imageBytes, "image/webp");
        }

        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadLocationImage(int id, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var battles = await _context.Battles.FindAsync(id);

            if (battles == null)
            {
                return NotFound("Location not found.");
            }

            var fileName = $"{id}_{Guid.NewGuid()}.webp";
            var filePath = Path.Combine(_imageDirectory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            battles.BattleImagePath = fileName;
            await _context.SaveChangesAsync();

            return Ok(new { path = $"/battles/{fileName}" });
        }

        // PUT: api/Battles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBattles(int id, Battles battles)
        {
            if (id != battles.BattlesId)
            {
                return BadRequest();
            }

            _context.Entry(battles).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BattlesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Battles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Battles>> PostBattles(Battles battles)
        {
            _context.Battles.Add(battles);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBattles", new { id = battles.BattlesId }, battles);
        }

        // DELETE: api/Battles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBattles(int id)
        {
            var battles = await _context.Battles.FindAsync(id);
            if (battles == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(battles.BattleImagePath))
            {
                var imagePath = Path.Combine(_imageDirectory, battles.BattleImagePath);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Battles.Remove(battles);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BattlesExists(int id)
        {
            return _context.Battles.Any(e => e.BattlesId == id);
        }
    }
}

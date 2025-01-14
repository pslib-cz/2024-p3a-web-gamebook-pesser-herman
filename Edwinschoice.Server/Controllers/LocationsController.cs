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
    public class LocationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _imageDirectory = Path.Combine("wwwroot", "images");

        public LocationsController(ApplicationDbContext context)
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
                .Where(c => c.FromId == id)
                .Include(c => c.To)
                .Select(c => new
                {
                    c.ToId,
                    c.To.LocationName,
                    c.To.LocationDescription,
                    c.ConnectionText
                })
                .ToList();

            return Ok(connections);
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Locations>>> GetLocations()
        {
            return await _context.Locations.ToListAsync();
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Locations>> GetLocations(int id)
        {
            // Zahrnutí 'Item' při načítání detailů o lokaci
            var location = await _context.Locations
                .Include(l => l.Item) // Načtení související položky
                .FirstOrDefaultAsync(l => l.LocationsId == id);

            if (location == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                location.LocationsId,
                location.LocationName,
                location.LocationDescription,
                location.LocationImagePath,
                location.ItemReobtainable,
                location.ItemId,
                Item = location.Item != null ? new
                {
                    location.Item.ItemsId,
                    location.Item.ItemName,
                    location.Item.ItemImagePath,
                    location.Item.isConsumable,
                    location.Item.forStory,
                    location.Item.ItemDescription,
                    location.Item.Health,
                    location.Item.Attack,
                    location.Item.Defense
                } : null
            });
        }

        [HttpGet("{id}/image")]
        public IActionResult GetLocationImage(int id)
        {
            var location = _context.Locations.Find(id);

            if (location == null || string.IsNullOrEmpty(location.LocationImagePath))
            {
                return NotFound();
            }

            var imagePath = Path.Combine(_imageDirectory, location.LocationImagePath);

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

            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                return NotFound("Location not found.");
            }

            var fileName = $"{id}_{Guid.NewGuid()}.webp"; 
            var filePath = Path.Combine(_imageDirectory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            location.LocationImagePath = fileName;
            await _context.SaveChangesAsync();

            return Ok(new { path = $"/images/{fileName}" });
        }

        // PUT: api/Locations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLocations(int id, Locations locations)
        {
            if (id != locations.LocationsId)
            {
                return BadRequest();
            }

            _context.Entry(locations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocationsExists(id))
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

        // POST: api/Locations
        [HttpPost]
        public async Task<ActionResult<Locations>> PostLocations(Locations locations)
        {
            _context.Locations.Add(locations);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLocations", new { id = locations.LocationsId }, locations);
        }

        // DELETE: api/Locations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocations(int id)
        {
            var locations = await _context.Locations.FindAsync(id);
            if (locations == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(locations.LocationImagePath))
            {
                var imagePath = Path.Combine(_imageDirectory, locations.LocationImagePath);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Locations.Remove(locations);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LocationsExists(int id)
        {
            return _context.Locations.Any(e => e.LocationsId == id);
        }
    }
}

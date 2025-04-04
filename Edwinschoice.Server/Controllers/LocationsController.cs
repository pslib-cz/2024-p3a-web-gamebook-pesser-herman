﻿using System;
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
                    ToId = c.ToId ?? c.ToBattleId, 
                    LocationName = c.ToId != null ? c.To.LocationName : c.ToBattle.EnemyName, 
                    LocationDescription = c.ToId != null ? c.To.LocationDescription : "Battle encounter!",
                    c.ConnectionText,
                    c.ItemId,
                    IsBattle = c.ToId == null 
                })
                .ToList();

            return Ok(connections);
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Locations>>> GetLocations()
        {
            var locations = await _context.Locations.Include(l => l.Item).ToListAsync();
            return Ok(locations.Select(l => new LocationDto(l)));
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationDto>> GetLocations(int id)
        {
            var location = await _context.Locations.Include(l => l.Item).FirstOrDefaultAsync(l => l.LocationsId == id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(new LocationDto(location));
        }

        public class LocationDto
        {
            public int LocationsId { get; set; }
            public string LocationName { get; set; } = "Unknown Location";
            public string LocationDescription { get; set; } = "No description available.";
            public string LocationImagePath { get; set; } = "/images/default.webp";
            public bool ItemReobtainable { get; set; } = false;
            public int? ItemId { get; set; } = null;
            public ItemDto Item { get; set; } = null;

            public LocationDto(Locations location)
            {
                LocationsId = location.LocationsId;
                LocationName = location.LocationName ?? "Unknown Location";
                LocationDescription = location.LocationDescription ?? "No description available.";
                LocationImagePath = !string.IsNullOrEmpty(location.LocationImagePath) ? location.LocationImagePath : "/images/default.webp";
                ItemReobtainable = location.ItemReobtainable ?? false;
                ItemId = location.ItemId;
                Item = location.Item != null ? new ItemDto(location.Item) : null;
            }
        }

        public class ItemDto
        {
            public int ItemsId { get; set; }
            public string ItemName { get; set; } = "Unknown Item";
            public string ItemImagePath { get; set; } = "/images/default-item.webp";
            public bool isConsumable { get; set; } = false;
            public bool forStory { get; set; } = false;
            public string ItemDescription { get; set; } = "No description available.";
            public int? Health { get; set; } = 0;
            public int? Attack { get; set; } = 0;
            public int? Defense { get; set; } = 0;

            public ItemDto(Items item)
            {
                ItemsId = item.ItemsId;
                ItemName = item.ItemName ?? "Unknown Item";
                ItemImagePath = !string.IsNullOrEmpty(item.ItemImagePath) ? item.ItemImagePath : "/images/default-item.webp";
                isConsumable = item.isConsumable;
                forStory = item.forStory;
                ItemDescription = item.ItemDescription ?? "No description available.";
                Health = item.Health;
                Attack = item.Attack;
                Defense = item.Defense;
            }
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

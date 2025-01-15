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
    public class EndingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly string _imageDirectory = Path.Combine("wwwroot", "endings");

        public EndingsController(ApplicationDbContext context)
        {
            _context = context;

            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }
        }

        // GET: api/Endings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Endings>>> GetEndings()
        {
            return await _context.Endings.ToListAsync();
        }

        // GET: api/Endings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Endings>> GetEndings(int id)
        {
            var endings = await _context.Endings.FindAsync(id);

            if (endings == null)
            {
                return NotFound();
            }

            return endings;
        }

        // GET: api/Endings/5/image
        [HttpGet("{id}/image")]
        public IActionResult GetEndingImage(int id)
        {
            var ending = _context.Endings.Find(id);

            if (ending == null || string.IsNullOrEmpty(ending.EndingImagePath))
            {
                return NotFound();
            }

            var imagePath = Path.Combine(_imageDirectory, ending.EndingImagePath);

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);
            return File(imageBytes, "image/png");
        }

        // POST: api/Ending/5/image
        [HttpPost("{id}/image")]
        public async Task<IActionResult> UploadEndingImage(int id, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var ending = await _context.Endings.FindAsync(id);

            if (ending == null)
            {
                return NotFound("Ending not found.");
            }

            var fileName = $"{id}_{Guid.NewGuid()}.png";
            var filePath = Path.Combine(_imageDirectory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            ending.EndingImagePath = fileName;
            await _context.SaveChangesAsync();

            return Ok(new { path = $"/endings/{fileName}" });
        }

        // PUT: api/Endings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEndings(int id, Endings endings)
        {
            if (id != endings.EndingsId)
            {
                return BadRequest();
            }

            _context.Entry(endings).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EndingsExists(id))
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

        // POST: api/Endings
        [HttpPost]
        public async Task<ActionResult<Endings>> PostEndings(Endings endings)
        {
            _context.Endings.Add(endings);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEndings", new { id = endings.EndingsId }, endings);
        }

        // DELETE: api/Endings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEndings(int id)
        {
            var endings = await _context.Endings.FindAsync(id);
            if (endings == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(endings.EndingImagePath))
            {
                var imagePath = Path.Combine(_imageDirectory, endings.EndingImagePath);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Endings.Remove(endings);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EndingsExists(int id)
        {
            return _context.Endings.Any(e => e.EndingsId == id);
        }
    }
}

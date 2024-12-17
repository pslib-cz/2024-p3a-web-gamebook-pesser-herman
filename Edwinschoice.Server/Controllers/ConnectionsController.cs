using System;
using System.Collections.Generic;
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
    public class ConnectionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConnectionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Connections
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Connections>>> GetConnections()
        {
            return await _context.Connections.ToListAsync();
        }

        // GET: api/Connections/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Connections>> GetConnections(int id)
        {
            var connections = await _context.Connections.FindAsync(id);

            if (connections == null)
            {
                return NotFound();
            }

            return connections;
        }

        // PUT: api/Connections/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConnections(int id, Connections connections)
        {
            if (id != connections.ConnectionsId)
            {
                return BadRequest();
            }

            _context.Entry(connections).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConnectionsExists(id))
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

        // POST: api/Connections
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Connections>> PostConnections(Connections connections)
        {
            _context.Connections.Add(connections);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConnections", new { id = connections.ConnectionsId }, connections);
        }

        // DELETE: api/Connections/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConnections(int id)
        {
            var connections = await _context.Connections.FindAsync(id);
            if (connections == null)
            {
                return NotFound();
            }

            _context.Connections.Remove(connections);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConnectionsExists(int id)
        {
            return _context.Connections.Any(e => e.ConnectionsId == id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DeepMusic.Data;
using DeepMusic.Models;

namespace DeepMusic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumsAPIController : ControllerBase
    {
        private readonly DeepMusicDbContext _context;

        public AlbumsAPIController(DeepMusicDbContext context)
        {
            _context = context;
        }

        // GET: api/AlbumsAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Albums>>> GetAlbums()
        {
            return await _context.Albums.ToListAsync();
        }

        // GET: api/AlbumsAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Albums>> GetAlbums(int id)
        {
            var albums = await _context.Albums.FindAsync(id);

            if (albums == null)
            {
                return NotFound();
            }

            return albums;
        }

        // PUT: api/AlbumsAPI/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAlbums(int id, Albums albums)
        {
            if (id != albums.Album_ID)
            {
                return BadRequest();
            }

            _context.Entry(albums).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlbumsExists(id))
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

        // POST: api/AlbumsAPI
        [HttpPost]
        public async Task<ActionResult<Albums>> PostAlbums(Albums albums)
        {
            _context.Albums.Add(albums);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAlbums", new { id = albums.Album_ID }, albums);
        }

        // DELETE: api/AlbumsAPI/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Albums>> DeleteAlbums(int id)
        {
            var albums = await _context.Albums.FindAsync(id);
            if (albums == null)
            {
                return NotFound();
            }

            _context.Albums.Remove(albums);
            await _context.SaveChangesAsync();

            return albums;
        }

        private bool AlbumsExists(int id)
        {
            return _context.Albums.Any(e => e.Album_ID == id);
        }
    }
}

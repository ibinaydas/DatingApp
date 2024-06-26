using System.Security.Claims;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await userRepository.GetMembersAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MemberDto>> GetUserById(int id)
    {
        var user = await userRepository.GetMemberByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return user;
    }

    [HttpGet("{name}")]
    public async Task<ActionResult<MemberDto>> GetUserByUsername(string name)
    {
        var user = await userRepository.GetMemberByNameAsync(name);
        if (user == null)
        {
            return NotFound();
        }
        return user;
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto updatedMember)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null)
        {
            return BadRequest("Username missing in request");
        }
        var user = await userRepository.GetUserByNameAsync(username);
        if (user == null)
        {
            return BadRequest("Not a valid user");
        }
        mapper.Map(updatedMember, user);
        if (await userRepository.SaveAllAsync())
        {
            return NoContent();
        }
        return BadRequest("Failed to update the user");
    }
}

using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserRepository userRepository) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        var users = await userRepository.GetMembersAsync();
        return Ok(users);
    }

    [Authorize]
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

    [Authorize]
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
}

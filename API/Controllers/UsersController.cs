using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseController
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
        var user = await userRepository.GetUserByNameAsync(User.GetUsername());
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

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByNameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("Not a valid user");
        }
        var results = await photoService.AddPhotoAsync(file);
        if (results.Error != null)
        {
            return BadRequest(results.Error.Message);
        }
        var photo = new Photo
        {
            Url = results.SecureUrl.AbsoluteUri,
            PublicId = results.PublicId
        };
        user.Photos.Add(photo);
        if (await userRepository.SaveAllAsync())
        {
            return CreatedAtAction(nameof(GetUserByUsername), new { name = user.UserName }, mapper.Map<PhotoDto>(photo));
        }
        return BadRequest("Problem adding the photo");
    }

    [HttpPut("set-main/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByNameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("Not a valid user");
        }
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain)
        {
            return BadRequest("Cannot set as main photo");
        }
        var currentPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentPhoto != null)
        {
            currentPhoto.IsMain = false;
        }
        photo.IsMain = true;
        if (await userRepository.SaveAllAsync())
        {
            return NoContent();
        }
        return BadRequest("Problem in setting the main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByNameAsync(User.GetUsername());
        if (user == null)
        {
            return BadRequest("Not a valid user");
        }
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null || photo.IsMain)
        {
            return BadRequest("Cannot delete photo");
        }
        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
        }
        user.Photos.Remove(photo);
        if (await userRepository.SaveAllAsync())
        {
            return Ok();
        }
        return BadRequest("Problem in deleting the photo");
    }
}

package com.login.controller;

import com.login.dto.UserDto;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import com.login.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.PageRequest;



@Tag(name = "Users", description = "Operations related to user accounts")
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Get paginated users", description = "Returns a paginated list of users")
    @ApiResponse(responseCode = "200", description = "Users paginated successfully")
    @GetMapping("/paged")
    public ResponseEntity<Page<UserDto>> getPagedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getAllPaged(PageRequest.of(page, size));
    }



    @Operation(summary = "Get user by ID", description = "Returns a user based on their ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id, Authentication authentication) {
        return userService.getByIdSecure(id, authentication);
    }

    @Operation(summary = "Get current authenticated user", description = "Returns the currently authenticated user's data")
    @ApiResponse(responseCode = "200", description = "Current user retrieved")
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        return userService.getByUsername(authentication.getName());
    }
    
    @Operation(summary = "Update current authenticated user", description = "Updates the currently authenticated user's data")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(@Valid @RequestBody UserDto userDto, Authentication authentication) {
        return userService.updateMyProfile(userDto, authentication);
    }


    @Operation(summary = "Update user by ID", description = "Updates a user's information based on ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @Valid @RequestBody UserDto userDto,
                                          Authentication authentication) {
        return userService.updateSecure(id, userDto, authentication);
    }

    @Operation(summary = "Delete user by ID", description = "Deletes a user based on ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        return userService.deleteSecure(id, authentication);
    }

    @Operation(summary = "Update user image", description = "Updates a user's profile image based on ID")
    @ApiResponse(responseCode = "200", description = "User image updated successfully")
    @PutMapping("/{id}/image")
    public ResponseEntity<UserDto> updateImage(@PathVariable Long id, @RequestParam("image") MultipartFile file,
                                               Authentication auth) {
        return userService.updateUserImage(id, file, auth);
    }
}

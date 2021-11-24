package com.essexboy.sixtysix;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    private PlayerService service;

    @Operation(summary = "Get all players")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found players",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Player.class))}),
            @ApiResponse(responseCode = "500", description = "System down",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SystemException.class))})
    })
    @GetMapping("/players")
    public ResponseEntity<List<Player>> get() {
        return new ResponseEntity<>(service.get(), HttpStatus.OK);
    }

    @Operation(summary = "Get an individual player")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found players",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Player.class))}),
            @ApiResponse(responseCode = "404", description = "Player not found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlayerNotFoundException.class))}),
            @ApiResponse(responseCode = "500", description = "System down",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SystemException.class))})
    })
    @GetMapping("/players/{id}")
    public ResponseEntity<Player> get(@PathVariable Long id) {
        return new ResponseEntity<>(service.get(id), HttpStatus.OK);
    }

    @Operation(summary = "Add players")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "System down",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SystemException.class))})
    })
    @PostMapping("/players")
    public ResponseEntity<Player> create(@RequestBody Player player) {
        return new ResponseEntity<>(service.createOrUpdate(player), HttpStatus.OK);
    }

    @Operation(summary = "Update players")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "System down",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SystemException.class))})
    })
    @PutMapping("/players")
    public ResponseEntity<Player> update(@RequestBody Player player) {
        return new ResponseEntity<>(service.createOrUpdate(player), HttpStatus.OK);
    }

    @Operation(summary = "Delete a player by Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Player not found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = PlayerNotFoundException.class))}),
            @ApiResponse(responseCode = "500", description = "System down",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = SystemException.class))})
    })
    @DeleteMapping("/players/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

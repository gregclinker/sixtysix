package com.essexboy.sixtysix;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {

    @Autowired
    private PlayerService service;

    @GetMapping("/players")
    public ResponseEntity<List<Player>> get() {
        return new ResponseEntity<>(service.get(), HttpStatus.OK);
    }

    @GetMapping("/players/{id}")
    public ResponseEntity<Player> get(@PathVariable Long id) {
        return new ResponseEntity<>(service.get(id), HttpStatus.OK);
    }

    @PostMapping("/players")
    public ResponseEntity<Player> create(@RequestBody Player player) {
        return new ResponseEntity<>(service.createOrUpdate(player), HttpStatus.OK);
    }

    @PutMapping("/players")
    public ResponseEntity<Player> update(@RequestBody Player player) {
        return new ResponseEntity<>(service.createOrUpdate(player), HttpStatus.OK);
    }

    @DeleteMapping("/players/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

package com.essexboy.sixtysix;

import java.util.Arrays;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PlayerServiceTest {
    
    @Autowired
    private PlayerService service;

    @Test
    void getAll() {
        assertEquals(22,service.get().size());
    }

    @Test
    void getOne() {
        final Player player = service.get(1L);
        assertEquals("Gordon",player.getFirstName());
    }

    @Test
    void createOrUpdate() {
        final Player orUpdate = service.createOrUpdate(new Player(null, 99, "XX", "Greg", "Clinker", 1, "Romford"));
        assertNotNull(orUpdate.getId());
        assertEquals(23,service.get().size());
    }

    @Test
    void delete() {
        final Player orUpdate = service.createOrUpdate(new Player(null, 99, "XX", "Greg", "Clinker", 1, "Romford"));
        assertNotNull(orUpdate.getId());
        assertEquals(23,service.get().size());
        service.delete(23l);
        assertEquals(22,service.get().size());
    }
    
    @Test
    void findHighestCaps()
    {
        assertEquals(68,service.mostCaps().getCaps());
    }
}
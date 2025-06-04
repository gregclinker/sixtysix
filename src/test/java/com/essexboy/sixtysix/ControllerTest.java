package com.essexboy.sixtysix;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
class ControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private PlayerService service;

    @Test
    void get() throws Exception {
        final String json = new ObjectMapper().writeValueAsString(service.get());
        mvc.perform(MockMvcRequestBuilders.get("/players")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(equalTo(json)));
    }

    @Test
    void getId() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/players/0")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteId() throws Exception {
        mvc.perform(MockMvcRequestBuilders.delete("/players/0")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
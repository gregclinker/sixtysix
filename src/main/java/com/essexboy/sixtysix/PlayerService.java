package com.essexboy.sixtysix;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository repository;

    @PostConstruct
    public void init() throws IOException {
        final InputStream inputStream = getClass().getResourceAsStream("/players.properties");
        final String content = IOUtils.toString(inputStream, Charset.defaultCharset());
        Arrays.stream(content.split("\n")).forEach(line -> {
            final String[] fields = line.split(",");
            repository.save(new Player(null, Integer.parseInt(fields[0]), fields[1], fields[2], fields[3], Integer.parseInt(fields[4]), fields[5]));
        });

    }

    public List<Player> get() {
        return repository.findAll();
    }

    public Player get(Long id) {
        return repository.findById(id).get();
    }

    public Player createOrUpdate(Player player) {
        return repository.save(player);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

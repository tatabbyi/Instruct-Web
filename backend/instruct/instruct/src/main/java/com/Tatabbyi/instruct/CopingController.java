package com.Tatabbyi.instruct;

import java.util.Arrays;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CopingController {
    @GetMapping("/coping")
    public List<String> getCopingStrategies(@RequestParam String emotion) {
        Map<String, List<String>> strategies = new HashMap<>();
        strategies.put("anxious", Arrays.asList(
            "To be added",
            "to be added"

        ));

        return strategies.getOrDefault(emotion.toLowerCase(), Arrays.asList("Strategies yet to be updates"));
    }
    
}

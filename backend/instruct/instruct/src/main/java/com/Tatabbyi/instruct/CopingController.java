package com.Tatabbyi.instruct;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CopingController {
    @GetMapping("/coping")
    public List<String> getCopingStrategies(@RequestParam String emotion) {
        Map<String, List<String>> strategies = new HashMap<>();
        strategies.put("anxious", Arrays.asList(
            "Set Goals for adressing anxiety: For Example Go outside, Talk to a stranger, Write down your fears.",
            "Identify what it interfers with: Work, school, relationships. Think about exactly how it causes distress in these situations",
            "Question when the anxiety begun, what does it stem from.",
            "Point out negative thoughts and settle them with positive ones.",
            "Consider your avoidance behaviour and how it might be contributing to your anxiety",
            "Sometimes we just have to feel emotions and there isnt one strategy to fix it all. You can only try your best.",
            "Consider any previous progress made in managing anxiety or what progress you would like to see",
            "<a href=\"https://books.google.ie/books?hl=en&lr=&id=he-0DwAAQBAJ&oi=fnd&pg=PT10&ots=aKwbveUTt1&sig=2khzNMMSofboKqDJOSfWxSLjLdc&redir_esc=y#v=onepage&q&f=false\">The Anxiety Skills Workbook</a>."

        ));

        return strategies.getOrDefault(emotion.toLowerCase(), Arrays.asList("Strategies yet to be updates"));
    }
    
}

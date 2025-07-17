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

        strategies.put("sad", Arrays.asList(
            "Set Goals for adressing sadness: Keep a journal to track your mood and express your sadness",
            "Identify what it interfers with: Work, school, relationships. Think about exactly how it causes problems in these situations",
            "It’s crucial to remember that you matter, too. Prioritize your self-care and mental health",
            "Point out negative thoughts and settle them with positive ones.",
            "Step away to somewhere quiet and take the time necessary to center yourself until you’re better able to face the stressor. ",
            "Sometimes we just have to feel emotions and there isnt one strategy to fix it all. You can only try your best.",
            "Consider any previous progress made in managing sadness or what progress you would like to see",
            "<a href=\"https://books.google.ie/books?hl=en&lr=&id=uLe2fJRHQGoC&oi=fnd&pg=PA121&dq=dealing+with+sadness&ots=m4sfs7v-55&sig=_tBaIdU8aqYYGyfQMCXJbbG94UA&redir_esc=y#v=onepage&q=dealing%20with%20sadness&f=false\">Re-constructing Emotional Spaces: From Experience to Regulation</a>."
        ));



        return strategies.getOrDefault(emotion.toLowerCase(), Arrays.asList("Strategies yet to be updates"));
    }
    
}

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

        strategies.put("tired", Arrays.asList(
            "If you feel you're suffering from fatigue, which is an overwhelming tiredness that isn't relieved by rest and sleep, you may have an underlying medical condition. Consult a GP for advice.",
            "A good way to keep up your energy through the day is to eat regular meals and healthy snacks every 3 to 4 hours, rather than a large meal less often.",
            "You might feel that exercise is the last thing on your mind. But, in fact, regular exercise will make you feel less tired in the long run, so you'll have more energy.",
            "Tips for sleeping well include: going to bed and getting up in the morning at the same time every day, avoiding naps in the day, taking time to relax before you go to bed",
            "Stress uses up a lot of energy. Try to introduce relaxing activities into your day.",
            "Caffeine is a stimulant which means it makes you feel more awake. But it can also disrupt your usual sleep rhythms, leading to problems sleeping and then daytime tiredness.",
            "Consider any previous progress made in managing fatigue or what progress you would like to see"
        ));

        strategies.put("angry", Arrays.asList(
            "Set Goals for adressing anger: Keep a journal to track your mood and express your anger",
            "Don’t dwell. Instead, try to let go of the past incident. One way to do that is to focus instead on things you appreciate about the person or the situation that made you angry.",
            "Change the way you think. Instead of thinking “Everything is ruined,” for example, tell yourself “This is frustrating, but it’s not the end of the world.”",
            "Point out negative thoughts and settle them with positive ones.",
            " People often jump to conclusions when they’re angry, and they can say the first (often unkind) thing that pops into their heads. Try to stop and listen before reacting. ",
            " Try to identify warning signs that you’re starting to get annoyed. When you recognize the signs, step away from the situation or try relaxation techniques to prevent your irritation from escalating.",
            "Consider any previous progress made in managing anger or what progress you would like to see",
            "<a href=\"https://books.google.ie/books?hl=en&lr=&id=TsdBDAAAQBAJ&oi=fnd&pg=PA1&dq=dealing+with+anger&ots=p3covhKKjw&sig=J2sXpCkYINl0Xqbj7Ym7P57LqX4&redir_esc=y#v=onepage&q=dealing%20with%20anger&f=false\">Anger: How to Live with and without It</a>."
        ));
        strategies.put("happy", Arrays.asList(
            "Keep a journal to track your mood and express your happiness",
            "Appreciate positive thoughts.",
            "Focus on the present moment. Try to be mindful and enjoy the little things in life.",
        ));
        strategies.put("calm", Arrays.asList(
            " Keep a journal to track your mood and express your calmness",
            "Apreciate thee things that make you feel calm.",
            "Focus on the present moment. Try to be mindful and enjoy the little things in life.",
            "Consider any previous progress made in managing your peace or what progress you would like to see",
        ));



        return strategies.getOrDefault(emotion.toLowerCase(), Arrays.asList("Strategies yet to be updates"));
    }
    
}

import { SpeakingPrompt } from "../types";

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: "ielts-spk-part2-1",
    exam: "IELTS",
    part: "IELTS Part 2 (Cue Card)",
    topic: "An Environmental Project or Initiative",
    instructions: "You will have 1 minute to prepare your notes and 2 minutes to speak uninterruptedly.",
    promptText: "Describe an environmental initiative or project in your local community or city that you found impressive.",
    bulletPoints: [
      "What the initiative or project was",
      "How you first discovered or learned about it",
      "What positive impacts it has had on the environment or residents",
      "And explain why you personally found this initiative noteworthy or inspiring.",
    ],
    prepTimeSeconds: 60,
    speakTimeSeconds: 120,
    keyVocabulary: ["Urban canopy", "Ecological sustainability", "Biodegradable", "Civic engagement", "Carbon footprint", "Grassroots movement"],
    modelAnswer: `I would like to talk about a municipal urban forestry initiative spearheaded in my hometown roughly two years ago, dubbed the 'Green Corridors Project'. 

The primary objective of this scheme was to transform neglected roadside verges, disused rail lines, and vacant industrial plots into interconnected linear parks populated with native drought-resistant trees and wildflowers. I first came across the project when our municipal council held a public consultation session in our neighborhood community center, inviting residents to sponsor saplings and volunteer for weekend planting drives.

In terms of environmental impact, the repercussions have been genuinely profound. Prior to this, our city center suffered intensely from the urban heat island effect, with blistering summer heat trapped between high-rise concrete structures. Within just 18 months of planting, localized surface temperatures along these corridors dropped measurably, and we began witnessing the return of migratory songbirds and pollinating insects that had been absent for decades. Furthermore, the initiative introduced permeable drainage bioswales alongside pedestrian footpaths, which virtually eliminated seasonal stormwater flooding in our precinct.

What made this project extraordinarily noteworthy to me was the profound sense of civic solidarity it fostered. Rather than being an impersonal top-down bureaucratic policy, it mobilized schools, retirees, and local business owners side by side. It proved to me that when sustainable urban planning is decentralized and community-driven, tangible ecological restoration is not just an idealistic ambition, but a viable reality.`,
  },
  {
    id: "ielts-spk-part1-1",
    exam: "IELTS",
    part: "IELTS Part 1",
    topic: "Work & Study Habits",
    instructions: "Answer these introductory questions naturally with 2-4 sentences per answer.",
    promptText: "Do you prefer studying or working in complete silence, or with background noise or music?",
    bulletPoints: [
      "Explain your ideal cognitive environment",
      "Mention what tasks benefit from music vs silence",
      "Reflect on how this has evolved over time",
    ],
    prepTimeSeconds: 10,
    speakTimeSeconds: 45,
    keyVocabulary: ["Cognitive focus", "Ambient noise", "Analytical tasks", "Subconscious distraction"],
    modelAnswer: "Personally, it depends heavily on the cognitive demand of the task. When I am tackling intensive analytical writing or reviewing complex academic texts, I require absolute silence to prevent extraneous cognitive load. However, when handling more routine organizational duties, I often find ambient instrumental music or low white noise helps sustain my momentum and wards off mental fatigue.",
  },
  {
    id: "ielts-spk-part3-1",
    exam: "IELTS",
    part: "IELTS Part 3",
    topic: "Technological Impact on Education",
    instructions: "Discuss this broader philosophical question analytically. Aim for a well-reasoned 60-90 second response.",
    promptText: "To what extent do you think artificial intelligence will transform the role of human educators in universities?",
    bulletPoints: [
      "Compare administrative automation with pedagogical mentorship",
      "Address personalized learning algorithms",
      "Evaluate empathy, critical debate, and moral reasoning that machines cannot replicate",
    ],
    prepTimeSeconds: 15,
    speakTimeSeconds: 90,
    keyVocabulary: ["Pedagogical paradigm", "Socratic dialogue", "Heuristic guidance", "Invaluable mentorship", "Bespoke feedback"],
    modelAnswer: `I firmly believe that artificial intelligence will catalyze a fundamental shift in university education, though it will complement rather than entirely supplant human professors. On one hand, automated machine learning algorithms excel at delivering bespoke practice drills, grading routine syntactic assessments, and synthesizing vast scientific literature at unprecedented speeds. 

However, true higher education is not merely the transmittal of factual information; it centers on Socratic dialogue, ethical interrogation, and intellectual resilience. A human educator models empathy, challenges preconceived biases, and inspires creative curiosity in ways an algorithmic prompt cannot emulate. Therefore, I envisage educators transitioning from conventional lecturers into mentors and epistemological guides who navigate students through complex ethical quandaries.`,
  },
  {
    id: "toefl-spk-task1-1",
    exam: "TOEFL",
    part: "TOEFL Task 1 (Independent)",
    topic: "University Policy: Mandatory Internships",
    instructions: "State your opinion clearly and support it with specific reasons and examples. You have 15 seconds to prepare and 45 seconds to speak.",
    promptText: "Some universities require all undergraduate students to complete a professional internship before graduation. Others believe students should focus solely on academic coursework. Which view do you support and why?",
    prepTimeSeconds: 15,
    speakTimeSeconds: 45,
    keyVocabulary: ["Empirical application", "Theoretical frameworks", "Employability", "Competitive advantage", "Bridging the gap"],
    modelAnswer: "I strongly believe universities should mandate professional internships for undergraduates for two central reasons. First, internships bridge the gap between theoretical classroom pedagogy and real-world execution. While textbooks elucidate principles, navigating genuine workplace deadlines and client deliverables builds practical competencies. Second, internships dramatically heighten post-graduate employability. Employers overwhelmingly favor graduates with demonstrated corporate exposure, networking connections, and collaborative soft skills over those with purely high GPAs.",
  },
  {
    id: "toefl-spk-task2-1",
    exam: "TOEFL",
    part: "TOEFL Task 2 (Integrated)",
    topic: "Campus Dining Hall Composting Mandate",
    instructions: "Read the university announcement, review the student reaction, then summarize the proposal and explain the student's perspective. 30s prep, 60s speak.",
    promptText: "Explain the student's stance regarding the university's plan to eliminate single-use plastics and introduce compulsory cafeteria composting.",
    readingSnippet: "University Bulletin: Starting October 1st, Campus Dining will eliminate all disposable plastic utensils and food containers in favor of reusable aluminum containers and compostable trays. Students will be required to separate food scraps into designated green organic bins.",
    listeningSnippet: "Student Reaction: 'I think this is an overdue initiative. Our campus generates nearly three tons of avoidable plastic waste every week. While some students complain about returning reusable trays, having automated deposit stations near the exits makes it effortless. Plus, the university plans to use the organic compost for our agricultural research garden, closing the loop completely.'",
    prepTimeSeconds: 30,
    speakTimeSeconds: 60,
    keyVocabulary: ["Single-use plastics", "Organic diversion", "Circular economy", "Automated deposit stations", "Overdue initiative"],
    modelAnswer: "The university announcement details a comprehensive sustainability policy eliminating single-use plastics in campus dining and mandating organic composting. In response, the student strongly endorses this initiative for two main reasons. First, he emphasizes that the campus currently discards roughly three tons of avoidable plastic weekly, making this ecological intervention long overdue. Although some peers express skepticism about the inconvenience of returning reusable trays, he argues that the automated exit deposit stations make compliance effortless. Second, he highlights that the composted organic matter will enrich the university's agricultural research garden, creating a genuine closed-loop ecological cycle.",
  },
];

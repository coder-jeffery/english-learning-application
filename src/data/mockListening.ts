import { ListeningSection } from "../types";

export const LISTENING_SECTIONS: ListeningSection[] = [
  {
    id: "ielts-sec-1",
    exam: "IELTS",
    title: "Section 1: Accommodation Inquiry & Booking",
    contextType: "social-dialogue",
    speakerDescription: "A university student (Sarah) calling a rental agency manager (Mr. Davis) about off-campus apartment rentals.",
    audioDurationSeconds: 140,
    script: `Agent: Good morning, City Property Lettings. How can I help you today?
Sarah: Hello. I'm looking for self-catering student accommodation for the upcoming semester starting in September.
Agent: Certainly! We have several flats available near the central university campus. Could I have your full name and contact number first?
Sarah: Yes, it's Sarah Jenkins. My phone number is 07945 882 119.
Agent: Thank you, Sarah. And what kind of price range were you considering per week?
Sarah: Well, my maximum budget is around 180 pounds per week, though I'd prefer something closer to 150 pounds if bills are included.
Agent: Right. We currently have a very popular studio flat on Elmwood Crescent. The weekly rent is 165 pounds, and that covers high-speed broadband and water rates, though electricity is billed separately via a smart meter.
Sarah: That sounds quite reasonable. How far is Elmwood Crescent from the main science library?
Agent: It's roughly a 12-minute walk, or you can take the number 42 bus, which stops directly opposite the entrance gate every ten minutes.
Sarah: Perfect. Does the flat come with any kitchen appliances, like a microwave or washing machine?
Agent: Yes, the kitchen was recently refurbished with a microwave, full oven, and there is a shared laundry room on the ground floor with commercial washing machines. There is also secure bicycle storage in the basement.
Sarah: Oh, that's great because I cycle everywhere. Could I arrange a viewing this Thursday afternoon?
Agent: Let me check the diary... Thursday at 3:30 PM is open with our property representative, Mark.
Sarah: 3:30 PM on Thursday works wonderfully. Thank you so much!`,
    questions: [
      {
        id: "lq-1",
        questionNumber: 1,
        type: "fill-blank",
        prompt: "Student's surname: Jenkins, contact telephone: 07945 ________",
        correctAnswer: "882 119",
        explanation: "In the dialogue, Sarah clearly specifies her number as '07945 882 119'.",
      },
      {
        id: "lq-2",
        questionNumber: 2,
        type: "mcq",
        prompt: "What is included in the £165 weekly rent for the Elmwood Crescent studio?",
        options: [
          "Electricity and water only",
          "High-speed broadband and water rates",
          "All utility bills and heating",
          "Council tax and cleaning services",
        ],
        correctAnswer: "High-speed broadband and water rates",
        explanation: "The agent explicitly states: 'The weekly rent is 165 pounds, and that covers high-speed broadband and water rates, though electricity is billed separately'.",
      },
      {
        id: "lq-3",
        questionNumber: 3,
        type: "mcq",
        prompt: "How long does it take to walk from the property to the science library?",
        options: [
          "Roughly 12 minutes",
          "Around 20 minutes",
          "Over 30 minutes",
          "5 minutes on foot",
        ],
        correctAnswer: "Roughly 12 minutes",
        explanation: "The agent states: 'It's roughly a 12-minute walk, or you can take the number 42 bus'.",
      },
      {
        id: "lq-4",
        questionNumber: 4,
        type: "fill-blank",
        prompt: "Special facility located in the basement: secure ________ storage.",
        correctAnswer: "bicycle",
        explanation: "The agent mentions: 'There is also secure bicycle storage in the basement'.",
      },
    ],
  },
  {
    id: "ielts-sec-4",
    exam: "IELTS",
    title: "Section 4: Academic Lecture on Biomimetic Robotics",
    contextType: "academic-lecture",
    speakerDescription: "Professor Julian Vance delivering an academic lecture on biomimicry and evolutionary adaptations in modern robotic engineering.",
    audioDurationSeconds: 180,
    script: `Welcome everyone to our fourth lecture in advanced bio-inspired robotics. Today, we turn our attention to biomimicry—the practice of emulating nature's time-tested designs to solve intricate engineering quandaries.

For millions of years, natural selection has optimized organisms for maximum energetic efficiency and resilience. Consider the gecko lizard. For decades, mechanical engineers struggled to produce adhesives that could adhere strongly to vertical surfaces without leaving chemical residues. By examining the microscopic structure of gecko toes, researchers discovered millions of tiny hair-like filaments called setae, which branch into even finer spatulae. These microscopic structures exploit van der Waals forces—weak electrostatic attractions between molecules—allowing the gecko to support its entire body weight on a single toe and disengage instantly without mechanical degradation.

Today, engineers at MIT and Stanford have synthesized synthetic dry adhesives inspired by this morphological adaptation. In aerospace engineering, these adhesive pads are now being deployed on autonomous satellites to capture and tether space debris without puncturing fuel tanks.

Another revolutionary application involves maritime propulsion. By analyzing the flippers of humpback whales, hydrodynamicists noted irregular bumps called tubercles along the leading edge. Rather than causing turbulence, these tubercles actually channel water flow into localized vortices, delaying aerodynamic stall and increasing lift by up to 32 percent. This counter-intuitive geometry is now incorporated into modern commercial wind turbine blades and submarine rudders, yielding massive reductions in drag and acoustic noise pollution.`,
    questions: [
      {
        id: "lq-5",
        questionNumber: 1,
        type: "mcq",
        prompt: "What microscopic mechanism enables geckos to climb vertical surfaces effortlessly?",
        options: [
          "Suction cups that generate continuous atmospheric vacuum",
          "Van der Waals forces operating through microscopic setae and spatulae",
          "Secretion of a fast-drying natural viscous polymer",
          "Static magnetic interaction with metallic substrates",
        ],
        correctAnswer: "Van der Waals forces operating through microscopic setae and spatulae",
        explanation: "The lecturer explains that microscopic hair-like filaments called setae branch into spatulae and exploit van der Waals forces.",
      },
      {
        id: "lq-6",
        questionNumber: 2,
        type: "fill-blank",
        prompt: "In aerospace, gecko-inspired adhesives are deployed on satellites to capture space ________.",
        correctAnswer: "debris",
        explanation: "The professor mentions adhesive pads deployed on autonomous satellites 'to capture and tether space debris'.",
      },
      {
        id: "lq-7",
        questionNumber: 3,
        type: "mcq",
        prompt: "What effect do the tubercles on humpback whale flippers have on fluid dynamics?",
        options: [
          "They create drag to slow down descending speed",
          "They channel fluid flow, delay stall, and boost lift by up to 32 percent",
          "They act as heat dissipaters during long-distance migration",
          "They prevent barnacles from attaching to the skin surface",
        ],
        correctAnswer: "They channel fluid flow, delay stall, and boost lift by up to 32 percent",
        explanation: "The professor states: 'these tubercles actually channel water flow into localized vortices, delaying aerodynamic stall and increasing lift by up to 32 percent'.",
      },
    ],
  },
  {
    id: "toefl-conv-1",
    exam: "TOEFL",
    title: "Campus Conversation: Academic Prerequisite Waiver",
    contextType: "campus-conversation",
    speakerDescription: "A biology undergraduate student speaking with a department academic advisor about enrolling in an advanced seminar.",
    audioDurationSeconds: 150,
    script: `Student: Hi, Professor Gallagher. Thanks for seeing me during office hours.
Advisor: Of course, Marcus. How can I help you? Registration for next semester closes this Friday.
Student: Right, that's what I'm concerned about. I really want to register for Biology 412—the Advanced Molecular Genetics seminar—but the system blocked my enrollment because it says I haven't completed Organic Chemistry II.
Advisor: Ah, yes. Organic Chem II is a strict prerequisite for 412 because Dr. Lindqvist assumes every student already understands synthesis pathways and stereochemistry.
Student: I understand, but over the summer, I completed an intensive 8-week biochemistry internship at the National Genomics Institute. I spent 40 hours a week conducting PCR assays and gene sequencing alongside doctoral researchers. My mentor, Dr. Rivera, wrote a formal letter detailing my laboratory competencies.
Advisor: That sounds impressive, Marcus. However, department policy requires either official course credit or departmental exam equivalence. An internship alone doesn't automatically substitute for lecture-based grading.
Student: Dr. Rivera mentioned that the department chair can approve a prerequisite waiver form if a student passes a diagnostic challenge exam. Is that exam offered this week?
Advisor: Yes, as a matter of fact, the chemistry department administers the diagnostic test every Wednesday at 2:00 PM in Halliburton Hall. If you score at or above 80 percent, the chair will sign the waiver immediately, and you can add Bio 412 before the Friday deadline.
Student: That's terrific! I will register for the diagnostic exam right away. Thank you, Professor!`,
    questions: [
      {
        id: "lq-8",
        questionNumber: 1,
        type: "mcq",
        prompt: "Why did the university registration system block Marcus from enrolling in Biology 412?",
        options: [
          "The course was already at maximum student capacity",
          "He lacked the required prerequisite course in Organic Chemistry II",
          "His academic GPA fell below the seminar's honors requirement",
          "He missed the departmental pre-registration deadline",
        ],
        correctAnswer: "He lacked the required prerequisite course in Organic Chemistry II",
        explanation: "Marcus explains: 'the system blocked my enrollment because it says I haven't completed Organic Chemistry II'.",
      },
      {
        id: "lq-9",
        questionNumber: 2,
        type: "mcq",
        prompt: "What solution does the advisor propose so Marcus can enroll before Friday?",
        options: [
          "Retake the class during the winter session",
          "Obtain an 80% or higher on Wednesday's chemistry diagnostic challenge exam",
          "Ask Dr. Lindqvist for an informal verbal exception",
          "Transfer his internship credits into another elective course",
        ],
        correctAnswer: "Obtain an 80% or higher on Wednesday's chemistry diagnostic challenge exam",
        explanation: "The advisor notes the challenge exam is Wednesday at 2:00 PM, and scoring 80% or above allows the chair to sign the waiver immediately.",
      },
    ],
  },
  {
    id: "toefl-lec-1",
    exam: "TOEFL",
    title: "Academic Lecture: Geology & Plate Tectonics Subduction",
    contextType: "academic-lecture",
    speakerDescription: "Dr. Catherine Thorne lecturing on oceanic trenches and deep mantle convective currents.",
    audioDurationSeconds: 165,
    script: `Today, we will investigate the geodynamics of subduction zones, often termed the 'recycling centers' of Earth's lithosphere. When two tectonic plates converge, the denser plate—typically cold, mature oceanic crust composed of basalt—is forced beneath the less dense continental or younger oceanic plate, sinking down into the asthenosphere.

A prime mystery in early geophysics was why oceanic plates sink so relentlessly once subduction initiates. It turns out that gravity is not simply pulling the surface crust down; rather, a profound metamorphic phase transition occurs. As the oceanic plate descends beyond 30 to 50 kilometers, immense lithostatic pressure and rising temperatures alter the mineral composition. Basalt and gabbro transform into eclogite, a rock dense with garnet and omphacite pyroxene.

Because eclogite is significantly denser than the surrounding mantle peridotite, it generates what geologists term 'slab pull'. This slab pull force actually constitutes the primary driving engine of global plate motion—exerting far greater mechanical force than the passive 'ridge push' generated at divergent mid-ocean ridges. Furthermore, as hydrous minerals in the descending slab dewater, the released water lowers the melting point of the overlying mantle wedge, giving rise to explosive island-arc volcanism, such as the Pacific Ring of Fire.`,
    questions: [
      {
        id: "lq-10",
        questionNumber: 1,
        type: "mcq",
        prompt: "What metamorphic rock transformation provides the fundamental mechanism behind 'slab pull'?",
        options: [
          "Granite transforming into sedimentary sandstone",
          "Basalt and gabbro transforming under high pressure into denser eclogite",
          "Peridotite melting into low-viscosity liquid magma",
          "Limestone recrystallizing into calcite marble",
        ],
        correctAnswer: "Basalt and gabbro transforming under high pressure into denser eclogite",
        explanation: "The lecturer explains that basalt and gabbro metamorphose into eclogite, which is denser than surrounding mantle peridotite and creates 'slab pull'.",
      },
      {
        id: "lq-11",
        questionNumber: 2,
        type: "mcq",
        prompt: "According to the professor, what triggers volcanic activity in the Pacific Ring of Fire?",
        options: [
          "Direct friction between tectonic boundaries scraping the continental edge",
          "Water released from descending hydrous minerals lowering the mantle melting point",
          "Mantle plumes puncturing stagnant crustal fault lines",
          "Tidal gravitational pull from the moon on subterranean magma chambers",
        ],
        correctAnswer: "Water released from descending hydrous minerals lowering the mantle melting point",
        explanation: "Dr. Thorne states: 'as hydrous minerals in the descending slab dewater, the released water lowers the melting point of the overlying mantle wedge, giving rise to explosive island-arc volcanism'.",
      },
    ],
  },
];

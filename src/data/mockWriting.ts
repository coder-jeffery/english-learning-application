import { WritingPrompt } from "../types";

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "ielts-wrt-task1-1",
    exam: "IELTS",
    taskType: "IELTS Task 1 (Academic)",
    title: "Global Investment in Renewable vs Fossil Energy (2015-2025)",
    instructions: "You should spend about 20 minutes on this task. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    promptText: "The chart illustrates global investment (in billions of USD) into Renewable Energy sources compared with Traditional Fossil Fuel generation between 2015 and 2025, alongside projections for 2030.",
    minWordCount: 150,
    recommendedTimeMinutes: 20,
    chartData: {
      type: "bar",
      title: "Global Clean Energy vs Fossil Investment ($ Billions USD)",
      labels: ["2015", "2018", "2021", "2024", "2030 (Est)"],
      datasets: [
        {
          label: "Renewables (Solar/Wind/Hydro)",
          values: [285, 340, 410, 520, 680],
          color: "#059669",
        },
        {
          label: "Fossil Fuels (Coal/Oil/Gas)",
          values: [510, 480, 430, 390, 290],
          color: "#dc2626",
        },
      ],
    },
    modelAnswer: `The bar chart delineates global financial capital allocation across renewable energy and traditional fossil fuels over a fifteen-year timeframe spanning from 2015 to 2024, with forward-looking estimates for 2030.

Overall, it is immediately apparent that while fossil fuel expenditures experienced a steady and uninterrupted downward trajectory, investment in clean renewable power underwent an exponential ascent, ultimately overtaking fossil fuels by 2024 and widening that lead substantially by 2030.

In 2015, conventional fossil fuels commanded the overwhelming majority of international investment, standing at $510 billion—nearly double the $285 billion allocated to renewables. Over the subsequent six years, capital devoted to fossil energy declined progressively to $480 billion in 2018 and $430 billion in 2021. Conversely, renewable funding surged rapidly during this period, rising to $340 billion in 2018 before nearly converging with fossil fuels at $410 billion in 2021.

By 2024, a decisive crossover occurred: clean energy allocations soared to $520 billion, whereas fossil investments contracted further to $390 billion. Projections for 2030 indicate that this divergence will become even more pronounced, with renewable capital expected to peak at $680 billion compared to a modest $290 billion for fossil sources.`,
  },
  {
    id: "ielts-wrt-task2-1",
    exam: "IELTS",
    taskType: "IELTS Task 2 (Essay)",
    title: "Government Expenditure: Space Exploration vs Terrestrial Public Services",
    instructions: "You should spend about 40 minutes on this task. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    promptText: "Some people argue that spending billions of dollars on space exploration is a luxury that cannot be justified while severe poverty and underfunded public healthcare persist on Earth. Others believe that space research is vital for technological advancement and human survival. Discuss both views and give your own opinion.",
    minWordCount: 250,
    recommendedTimeMinutes: 40,
    modelAnswer: `In an era characterized by pressing domestic socio-economic strain, the multi-billion-dollar budgetary allocations directed toward extraterrestrial exploration have become a subject of fierce debate. While critics contend that addressing immediate terrestrial deprivation must take precedence over astronomical endeavors, proponents maintain that space research yields transformative technological dividends indispensable to human advancement. This essay examines both viewpoints before articulating a balanced perspective.

Opponents of space expenditure present a compelling humanitarian argument centered on opportunity cost. Millions worldwide endure precarious living conditions, substandard healthcare infrastructure, and erratic clean water access. Diverting astronomical sums toward interplanetary probes or lunar orbital stations strikes many as an unjustifiable indulgence when these resources could directly eradicate preventable epidemics, subsidize universal education, or insulate vulnerable coastal populations from the acute ravages of climate change. From an ethical utilitarian standpoint, securing the immediate well-being of extant human populations on Earth appears manifestly more urgent than surveying remote barren celestial bodies.

Conversely, advocates assert that space missions are not isolated vacuums of fiscal squandering, but catalysts for pioneering technological breakthroughs that fundamentally benefit terrestrial civilization. Historical precedents illustrate that investments in aerospace engineering have inadvertently birthed satellite telecommunications, global positioning systems (GPS), water purification filtration, and advanced solar photovoltaic cells—technologies upon which modern medicine and logistics now fundamentally rely. Furthermore, Earth's escalating ecological vulnerability underscores the prudence of exploring off-world resource extraction and planetary surveillance to identify catastrophic climate tipping points or asteroid hazards.

In conclusion, while the urgency of alleviating acute poverty and modernizing public healthcare cannot be overstated, disinvesting entirely from space exploration would be dangerously short-sighted. A prudent administration should maintain a measured equilibrium: channeling the majority of revenues into immediate public welfare while sustaining strategic, cross-national aerospace consortiums to safeguard our long-term technological and existential future.`,
  },
  {
    id: "toefl-wrt-task1-1",
    exam: "TOEFL",
    taskType: "TOEFL Task 1 (Integrated)",
    title: "Integrated Writing: The Viability of Ocean Iron Fertilization",
    instructions: "Read the passage, listen to the lecture counterpoints, and summarize how the lecturer casts doubt on the specific solutions presented in the reading. Write 150-225 words.",
    promptText: "Summarize the points made in the lecture, being sure to explain how they challenge the specific arguments in favor of ocean iron fertilization set forth in the reading passage.",
    minWordCount: 150,
    recommendedTimeMinutes: 20,
    integratedReadingSnippet: `Ocean iron fertilization (OIF) has emerged as a promising geoengineering technique to combat global atmospheric warming. 
First, adding iron sulfate into nutrient-poor ocean regions induces massive phytoplankton blooms, which absorb atmospheric carbon dioxide through photosynthesis and sequester it permanently on the deep seafloor when they perish. 
Second, it rejuvenates marine food webs, causing a rapid population surge in krill, fish, and marine mammals. 
Third, proponents claim OIF is exceptionally cost-effective compared to mechanical carbon capture plants.`,
    integratedListeningSummary: `The professor emphatically disputes the efficacy and safety of iron fertilization. 
First, deep-sea robotic probes reveal that up to 90% of the carbon captured by surface plankton is metabolized and respired back into the atmosphere by upper-ocean bacteria before ever reaching the abyssal ocean floor. 
Second, excessive blooms stimulate toxic pseudo-nitzschia algae, which produce domoic acid—a neurotoxin lethal to marine mammals. 
Third, unforeseen geopolitical disputes over open-ocean chemical dumping would necessitate massive regulatory oversight costs, eliminating any purported financial savings.`,
    modelAnswer: `Both the reading passage and the lecture discuss ocean iron fertilization (OIF) as a proposed geoengineering solution to counteract anthropogenic climate change. While the author highlights three principal benefits of this methodology, the lecturer disputes each claim, arguing that the strategy is inefficient, ecologically hazardous, and financially fraught.

First, the reading asserts that iron-induced phytoplankton blooms permanently sequester carbon dioxide upon sinking to the abyssal seabed. However, the speaker refutes this by citing recent robotic probe data showing that nearly ninety percent of surface organic carbon is consumed and respired back into the atmosphere by marine bacteria long before it can reach deep benthic sediments.

Second, whereas the passage suggests that fertilization enriches the marine food pyramid, the professor cautions that intense blooms frequently provoke proliferation of harmful algae like Pseudo-nitzschia. These organisms secrete domoic acid, a virulent neurotoxin that decimates krill, fish, and apex marine mammals, thereby destabilizing rather than revitalizing the ecosystem.

Finally, the lecturer challenges the claim of low economic cost by noting that unilateral chemical dispersal in international waters would ignite severe geopolitical conflict, demanding exorbitant diplomatic and monitoring enforcement that nullifies any projected financial advantage.`,
  },
  {
    id: "toefl-wrt-task2-1",
    exam: "TOEFL",
    taskType: "TOEFL Task 2 (Academic Discussion)",
    title: "Writing for an Academic Discussion: Remote vs In-Office Work",
    instructions: "Your professor is teaching a class on organizational sociology. Write a post responding to the professor's question. Express and support your personal opinion, and contribute to the discussion by engaging with your classmates' ideas. Write at least 100 words. You have 10 minutes.",
    promptText: "Should corporate employers enforce mandatory return-to-office policies or permit permanent remote work flexibilities?",
    minWordCount: 100,
    recommendedTimeMinutes: 10,
    discussionContext: {
      professorPrompt: "Welcome to this week's discussion forum! As corporate organizations navigate the post-pandemic labor landscape, intense debate surrounds workspace arrangements. Some corporate executives argue that mandatory in-office presence is vital for corporate culture and spontaneous creative collaboration. Conversely, many labor economists claim remote flexibility enhances employee satisfaction and productivity while widening talent pools. In your view, which approach yields superior long-term outcomes for modern organizations and their workforce?",
      studentResponses: [
        {
          name: "Claire",
          avatar: "C",
          response: "I strongly favor mandatory in-office work. Physical proximity creates informal mentorship opportunities for junior staff that simply cannot happen over scheduled video calls. Spontaneous hallway chats often spark the most innovative product breakthroughs.",
        },
        {
          name: "Paul",
          avatar: "P",
          response: "I disagree with Claire. Forcing everyone back to the office ignores the enormous burden of daily commuting, which causes burnout and wastes hours that could be spent working or with family. Companies that offer remote flexibility attract top global talent rather than being restricted to local commuters.",
        },
      ],
    },
    modelAnswer: `While Claire makes a valid point regarding the serendipity of in-person interactions, I firmly align with Paul's perspective that flexible remote working models yield vastly superior long-term outcomes for contemporary organizations. 

Firstly, eliminating arduous daily commutes directly ameliorates employee mental well-being and productivity. When professionals are spared hours of congested transit, they channel conserved energy into higher-quality cognitive output, leading to reduced absenteeism and lower turnover rates. Secondly, geographical flexibility democratizes recruitment: enterprise firms can attract specialized software engineers or data analysts regardless of their physical domicile, fostering a truly diverse and competitive workforce. Rather than imposing rigid, punitive physical mandates, progressive corporations should institute hybrid frameworks where employees convene on-site for purposeful quarterly strategic summits while executing routine operational tasks autonomously from home.`,
  },
];

const sampleEntryTestData = {
  title: "Comprehensive English Proficiency Test",
  description: "A thorough assessment of English language skills across listening, reading, writing and speaking domains",
  testType: "English Proficiency",
  totalTime: 180,
  sections: [
    {
      name: "Listening",
      description: "Test your English listening comprehension through various audio materials",
      timeLimit: 45,
      passages: [
        {
          text: "Lecture transcript about renewable energy sources...",
          questions: [
            {
              type: "multipleChoice",
              text: "What is the main focus of the lecture?",
              options: [
                { text: "Solar power advantages", isCorrect: true },
                { text: "Wind energy limitations", isCorrect: false },
                { text: "Nuclear power risks", isCorrect: false },
                { text: "Fossil fuel usage", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "multipleChoice",
              text: "According to the speaker, what percentage of global energy could come from renewable sources by 2050?",
              options: [
                { text: "25%", isCorrect: false },
                { text: "50%", isCorrect: false },
                { text: "75%", isCorrect: true },
                { text: "100%", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "fillInTheBlank",
              text: "The cost of solar panels has decreased by ___ percent in the last decade.",
              correctAnswer: "80",
              points: 2
            }
          ]
        },
        {
          text: "Conversation about workplace changes...",
          questions: [
            {
              type: "multipleChoice",
              text: "What is the main topic of discussion?",
              options: [
                { text: "Office renovation", isCorrect: false },
                { text: "Remote work policy", isCorrect: true },
                { text: "Salary negotiations", isCorrect: false },
                { text: "Team building", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "trueFalse",
              text: "The company plans to maintain a hybrid work model permanently.",
              correctAnswer: true,
              points: 2
            },
            {
              type: "multipleChoice",
              text: "How often will employees need to come to the office?",
              options: [
                { text: "Daily", isCorrect: false },
                { text: "Three times a week", isCorrect: true },
                { text: "Once a week", isCorrect: false },
                { text: "Never", isCorrect: false }
              ],
              points: 2
            }
          ]
        },
        {
          text: "News report about technological innovations...",
          questions: [
            {
              type: "multipleChoice",
              text: "What new technology is being discussed?",
              options: [
                { text: "Quantum computing", isCorrect: true },
                { text: "5G networks", isCorrect: false },
                { text: "Virtual reality", isCorrect: false },
                { text: "Artificial intelligence", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "fillInTheBlank",
              text: "The technology is expected to revolutionize ___ industry first.",
              correctAnswer: "pharmaceutical",
              points: 2
            }
          ]
        }
      ]
    },
    {
      name: "Reading",
      description: "Assess your reading comprehension through various text types",
      timeLimit: 60,
      passages: [
        {
          text: "Article about artificial intelligence in healthcare...",
          questions: [
            {
              type: "multipleChoice",
              text: "What is the primary benefit of AI in healthcare according to the passage?",
              options: [
                { text: "Cost reduction", isCorrect: false },
                { text: "Improved diagnosis accuracy", isCorrect: true },
                { text: "Faster patient processing", isCorrect: false },
                { text: "Better record keeping", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "matching",
              text: "Match the AI applications with their healthcare uses:",
              matchingPairs: [
                { left: "Machine Learning", right: "Disease Prediction" },
                { left: "Computer Vision", right: "Medical Imaging" },
                { left: "Natural Language Processing", right: "Patient Records Analysis" }
              ],
              points: 3
            },
            {
              type: "trueFalse",
              text: "AI will completely replace human doctors within the next decade.",
              correctAnswer: false,
              points: 2
            }
          ]
        },
        {
          text: "Research paper on climate change impacts...",
          questions: [
            {
              type: "multipleChoice",
              text: "What is the most significant impact of climate change mentioned?",
              options: [
                { text: "Rising sea levels", isCorrect: true },
                { text: "Deforestation", isCorrect: false },
                { text: "Air pollution", isCorrect: false },
                { text: "Urban development", isCorrect: false }
              ],
              points: 2
            },
            {
              type: "ordering",
              text: "Order the following events from earliest to latest impact:",
              orderItems: [
                "Temperature increase",
                "Glacier melting",
                "Coastal flooding",
                "Population displacement"
              ],
              points: 4
            }
          ]
        }
      ]
    },
    {
      name: "Writing",
      description: "Demonstrate your written English proficiency",
      timeLimit: 45,
      questions: [
        {
          type: "essay",
          text: "Write an essay discussing the impact of social media on modern society. Consider both positive and negative effects. (300-350 words)",
          points: 20
        },
        {
          type: "shortAnswer",
          text: "Explain three ways to reduce personal carbon footprint. (50-75 words)",
          points: 10
        },
        {
          type: "essay",
          text: "Compare and contrast traditional education with online learning. Which do you think is more effective and why? (250-300 words)",
          points: 15
        },
        {
          type: "shortAnswer",
          text: "Describe a significant technological innovation of the past decade and its impact. (50-75 words)",
          points: 10
        }
      ]
    },
    {
      name: "Speaking",
      description: "Demonstrate your English speaking abilities",
      timeLimit: 30,
      questions: [
        {
          type: "speaking",
          text: "Introduce yourself and describe your educational background and career aspirations. (2-3 minutes)",
          points: 10
        },
        {
          type: "speaking",
          text: "Describe this graph showing global temperature changes over the past century. What trends do you observe? (2-3 minutes)",
          imageFile: null, // Placeholder for graph image
          points: 15
        },
        {
          type: "speaking",
          text: "Express your opinion on whether artificial intelligence will have a positive or negative impact on employment. Support your view with examples. (3-4 minutes)",
          points: 15
        },
        {
          type: "speaking",
          text: "Look at these two images showing urban development over time. Compare and contrast the changes you observe. (2-3 minutes)",
          imageFile: null, // Placeholder for comparison images
          points: 10
        },
        {
          type: "speaking",
          text: "Role play: You are a job interviewer. Ask appropriate questions to assess a candidate's suitability for a marketing position. (3-4 minutes)",
          points: 15
        }
      ]
    }
  ]
};

export default sampleEntryTestData;
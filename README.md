# API powered AI Presentation Analyser

The API powered AI Presentation Analyser is a premium, AI powered tool designed to transform your presentation preparation. Built with Next.js 14 and powered by the Groq API (Llama-3-70b), it provides deep structural analysis, emotive mood detection, and predictive audience question and answers all wrapped in a stunning, high-performance interface.

---

## ✨ Key Features

- **🧠 Deep Structural Analysis**: Get an overall score and actionable suggestions to improve your script's flow and impact.
- **🎭 Mood Detection**: Real-time sentiment analysis to ensure your tone matches your objective.
- **🙋 Audience Q&A Predictor**: Pre-empt tough questions with AI-generated responses and strategies.
- **✏️ Interactive Refinement**: Edit your script and re-analyse in-place without losing your flow.
- **💎 Premium UI/UX**: Experience a state-of-the-art interface featuring
---
## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Turbopack)
- **Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI API**: [Groq SDK](https://groq.com/) (Llama-3-70b-versatile)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---


## 📌 What This App Does

The API powered AI Presentation Analyser helps users improve their presentation scripts by providing intelligent feedback before they present.  
Instead of guessing whether your script is good, the app evaluates it and gives clear, actionable insights.

### ❗ Problem It Solves
Many students struggle with:
- Poorly structured presentations  
- Unclear or mismatched tone  
- Difficulty anticipating audience questions  

This often leads to low confidence and ineffective delivery.

The app solves this by acting like a **personal AI presentation coach**, giving instant feedback and preparation support.

---

## 🤖 How It Uses AI

The application uses the **Groq API (Llama-3-70b)** to analyse user input in real time.

AI is used to:
- Score the overall quality of the script (out of 10)  
- Detect the emotional tone (e.g., confident, persuasive, neutral)  
- Suggest improvements for clarity, structure, and engagement  
- Generate likely audience questions with suggested answers  

This transforms a simple script into a **fully analysed and optimised presentation plan**.

---

## 🎓 How It Benefits the Student Journey

This tool directly supports students by:

- 📈 Improving presentation quality and grades  
- 🧠 Building confidence before presenting  
- 🎯 Helping students communicate ideas more clearly  
- 🤝 Preparing them for real-world scenarios like interviews and pitches  

It bridges the gap between **writing a script** and **delivering an effective presentation**.

---


## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Gladnx/ai-presentation-analyser.git
cd ai-presentation-analyser
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_api_key_here
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the magic.

---
## Example Input and Output

### Example Input
```text
Good morning everyone. Today, I'd like to share our vision for the future of AI. We believe that artificial intelligence shouldn't just be about automation; it should be about augmentation. Imagine a world where your tools don't just follow instructions, but actually understand your intent. By focusing on human-centric design, we can create systems that empower creativity rather than replacing it. I'm excited to show you what we've been building and how it will transform your daily workflow. Thank you for being here.
```

### Example Output
```json
{
  "score": 4,
  "mood": "Inspirational",
  "improvements": [
    "Add more specific examples to illustrate the concept of human-centric design and its benefits",
    "Provide a clearer definition of what is meant by 'augmentation' and how it differs from automation",
    "Include more details about the systems that have been built and how they will transform daily workflows"
  ],
  "questions": [
    {
      "question": "What exactly do you mean by 'human-centric design'?",
      "answer": "Provide a concise definition and example of how this approach has been applied in your project"
    },
    {
      "question": "How does your approach to AI differ from what others are doing in the field?",
      "answer": "Be prepared to discuss your unique value proposition and what sets your work apart"
    },
    {
      "question": "Can you give us a concrete example of how your system will 'empower creativity'?",
      "answer": "Use a specific scenario or case study to demonstrate the potential impact of your technology"
    },
    {
      "question": "What kind of timeline are we looking at for the rollout of these new systems?",
      "answer": "Provide a general outline of your development and deployment plans, even if exact dates are not yet available"
    },
    {
      "question": "How will these new systems be integrated into our existing workflows?",
      "answer": "Discuss any plans for training, support, or other resources that will be available to help users adapt to the new technology"
    }
  ]
}
```

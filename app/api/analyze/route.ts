import { NextResponse } from "next/server";

const fallback = (goal: string, answers: string[]) => ({
  career: goal || "GenAI Engineer",
  readiness: 46,
  summary: "You have a solid programming foundation, but your biggest opportunity is moving from using AI APIs to understanding how reliable GenAI systems are built and evaluated.",
  skills: [
    { name: "Python", score: 82 },
    { name: "Machine Learning", score: 61 },
    { name: "Deep Learning", score: 43 },
    { name: "LLMs", score: 28 },
    { name: "RAG", score: 12 },
    { name: "MLOps", score: 5 }
  ],
  gaps: [
    { name: "RAG architecture", level: "Critical" },
    { name: "LLM evaluation", level: "Critical" },
    { name: "Vector databases", level: "High" },
    { name: "MLOps & deployment", level: "High" }
  ],
  roadmap: [
    ["Understand embeddings", "Build the mental model behind semantic search."],
    ["Build semantic search", "Implement retrieval over a small knowledge base."],
    ["Master retrieval", "Diagnose chunking and relevance failures."],
    ["Build a RAG system", "Connect retrieval, generation and citations."],
    ["Evaluate quality", "Measure retrieval and answer quality."],
    ["Debug failure modes", "Fix hallucination and irrelevant-context cases."],
    ["Capstone challenge", "Build and defend a production-ready mini-RAG system."]
  ]
});

export async function POST(req: Request) {
  const body = await req.json();
  const goal = body.goal || "GenAI Engineer";
  const answers = body.answers || [];
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json(fallback(goal, answers));

  const prompt = `You are AbhyasMarg, an autonomous career-to-mastery learning agent. Analyze this college student's target career and diagnostic answers. Return ONLY valid JSON with keys: career, readiness (0-100), summary, skills (array of {name,score}), gaps (array of {name,level}), roadmap (array of [title,description], exactly 7 items). Keep skills to 6 items. Make gaps and roadmap specific to the career. Target: ${goal}. Diagnostic answers: ${JSON.stringify(answers)}`;
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body: JSON.stringify({model: process.env.OPENAI_MODEL || "gpt-5.6-luna", input: prompt})
    });
    const data = await r.json();
    const text = data.output_text || data.output?.flatMap((x:any)=>x.content||[]).map((x:any)=>x.text||"").join("") || "";
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g,"").trim()));
  } catch {
    return NextResponse.json(fallback(goal, answers));
  }
}
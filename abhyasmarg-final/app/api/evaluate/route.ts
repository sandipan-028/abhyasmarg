import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answer } = await req.json();
  const fallback = {
    score: 74,
    verdict: "Good reasoning, but your evaluation strategy needs more depth.",
    strengths: ["You identified the retrieval stage as a likely failure point.", "You proposed measuring results rather than relying only on subjective quality."],
    improve: ["Add a retrieval metric such as Recall@K or MRR.", "Separate retrieval quality from final answer quality.", "Create a small labelled evaluation set before changing the pipeline."]
  };
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json(fallback);
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body:JSON.stringify({model:process.env.OPENAI_MODEL || "gpt-5.6-luna", input:`Evaluate this student's answer to a RAG debugging challenge. Return ONLY JSON with score (0-100), verdict, strengths (2 strings), improve (3 strings). Answer: ${answer}`})
    });
    const data = await r.json();
    const text = data.output_text || "";
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g,"").trim()));
  } catch { return NextResponse.json(fallback); }
}
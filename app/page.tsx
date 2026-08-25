"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, BrainCircuit, Target, Sparkles, ShieldCheck } from "lucide-react";

type Skill = { name: string; score: number };
type Plan = { career: string; readiness: number; summary: string; skills: Skill[]; gaps: { name: string; level: string }[]; roadmap: [string, string][] };

const questions = [
  "How comfortable are you with Python?",
  "How well do you understand machine learning fundamentals?",
  "Have you built a deep learning project?",
  "How comfortable are you with LLM APIs and prompt design?",
  "Have you built a RAG or semantic-search application?",
  "How confident are you deploying AI applications?"
];
const opts = ["Beginner", "Learning", "Comfortable", "Advanced"];

export default function Home() {
  const [screen, setScreen] = useState<"home" | "diagnostic" | "analysis" | "dashboard">("home");
  const [goal, setGoal] = useState("GenAI Engineer");
  const [q, setQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);

  const start = () => { setScreen("diagnostic"); setQ(0); setAnswers([]); };
  const choose = (o: string) => {
    setSelected(o);
    setTimeout(() => {
      const next = [...answers, o]; setAnswers(next);
      if (q < questions.length - 1) { setQ(q + 1); setSelected(""); }
      else runAnalysis(next);
    }, 180);
  };
  async function runAnalysis(ans: string[]) {
    setScreen("analysis");
    const r = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal, answers: ans }) });
    const data = await r.json();
    setPlan(data);
    setTimeout(() => setScreen("dashboard"), 1200);
  }
  async function evaluate() {
    setEvaluating(true);
    const r = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }) });
    setEvaluation(await r.json()); setEvaluating(false);
  }

  if (screen === "home") return <main className="shell"><Nav /><section className="hero container">
    <div>
      <div className="eyebrow">AI career-to-mastery agent</div>
      <h1>Turn <em>ambition</em> into mastery.</h1>
      <p>AbhyasMarg continuously diagnoses what you know, finds what you are missing, and builds the next best learning action for the career you want.</p>
      <div className="card" style={{ maxWidth: 620, margin: "0 auto", textAlign: "left" }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>MY CAREER GOAL</div>
        <input value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%", background: "#07111f", border: "1px solid #23334d", borderRadius: 12, padding: 16, color: "#fff", outline: "none", fontSize: 18 }} />
        <button className="cta" onClick={start} style={{ marginTop: 14, width: "100%" }}>Start my journey <ArrowRight size={17} style={{ verticalAlign: "middle" }} /></button>
      </div>
      <div className="flow"><span>Diagnose</span><span>Map gaps</span><span>Learn</span><span>Practice</span><span>Evaluate</span><span>Adapt</span></div>
      <div className="small">Built for students who know where they want to go — but not what to do next.</div>
    </div>
  </section></main>;

  if (screen === "diagnostic") return <main className="shell"><Nav /><section className="page container">
    <div style={{ maxWidth: 720, margin: "0 auto" }}><div className="eyebrow">Diagnostic • {q + 1}/{questions.length}</div>
      <div className="progress"><i style={{ width: `${(q / questions.length) * 100}%` }} /></div>
      <div className="card"><div className="muted" style={{ marginBottom: 14 }}>Target: {goal}</div><h2 className="question">{questions[q]}</h2>
        <div className="options">{opts.map(o => <button key={o} className={"option " + (selected === o ? "selected" : "")} onClick={() => choose(o)}>{o}</button>)}</div>
      </div></div>
  </section></main>;

  if (screen === "analysis") return <main className="shell"><Nav /><section className="analysis container"><div style={{ textAlign: "center" }}><div className="eyebrow">AbhyasMarg is thinking</div><h1 className="title">Building your path to {goal}</h1><div className="agent-list">
    {["Profile Agent analyzed your responses", "Career Agent mapped role requirements", "Gap Agent identified your critical gaps", "Learning Agent generated your next 7 actions", "Assessment Agent prepared your first challenge"].map((x, i) => <div className="agent" key={x}><Check className="check" size={18} />{x}</div>)}</div></div></section></main>;

  if (!plan) return null;
  return <main className="shell"><Nav /><section className="page container">
    <div className="row" style={{ marginBottom: 25 }}><div><div className="eyebrow">Your learning command center</div><h1 className="title">{goal}</h1><p className="muted">{plan.summary}</p></div><span className="pill">Agent loop active</span></div>
    <div className="dashboard-grid">
      <div className="card"><div className="muted">CAREER READINESS</div><div className="score">{plan.readiness}%</div><div className="trend">↑ Your first diagnostic is complete</div>
        <div className="skills">
          {plan.skills.map(s => (
            <div key={s.name}>
              <div className="skill-head">
                <span>{s.name}</span>
                <b>{s.score}%</b>
              </div>
              <div className="bar">
                <i style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card"><div className="muted">CRITICAL GAPS</div>{plan.gaps.map(g => <div className="gap" key={g.name}><b>{g.level}</b><div style={{ marginTop: 4 }}>{g.name}</div></div>)}<div style={{ marginTop: 20 }} className="muted">The agent prioritizes gaps by career impact, not course popularity.</div></div>
    </div>
    <div className="card" style={{ marginTop: 18 }}><div className="row"><div><div className="eyebrow">Personalized path</div><h2 style={{ margin: "6px 0 18px" }}>Your next 7 days</h2></div><span className="pill">Generated for you</span></div><div className="roadmap">{plan.roadmap.map((d, i) => <div className="day" key={i}><div className="daynum">{i + 1}</div><div><h4>{d[0]}</h4><p>{d[1]}</p></div></div>)}</div></div>
    <div className="card mission" style={{ marginTop: 18 }}><div className="row"><div><div className="eyebrow">Today's mission</div><h2 style={{ margin: "6px 0" }}>Fix a broken RAG pipeline</h2><p className="muted">A retrieval system is returning irrelevant chunks. Explain what you would inspect first and how you would prove the fix worked.</p></div><BrainCircuit size={38} color="#8da2ff" /></div>
      <textarea placeholder="Write your approach..." value={answer} onChange={e => setAnswer(e.target.value)} style={{ marginTop: 18 }} />
      <button className="cta" onClick={evaluate} disabled={evaluating || !answer.trim()} style={{ marginTop: 12 }}>{evaluating ? "Agent evaluating…" : "Submit for AI evaluation"} <ArrowRight size={16} style={{ verticalAlign: "middle" }} /></button>
      {evaluation && <div className="result card"><div className="eyebrow">Assessment Agent</div><div className="scorebig">{evaluation.score}/100</div><p>{evaluation.verdict}</p><div>{evaluation.strengths?.map((x: string) => <span className="tag" key={x}>✓ {x}</span>)}</div><h4>Next improvement</h4>{evaluation.improve?.map((x: string) => <div className="muted" key={x}>→ {x}</div>)}</div>}
    </div>
    <div className="small" style={{ textAlign: "center", marginTop: 30 }}>AbhyasMarg closes the loop: Diagnose → Learn → Practice → Evaluate → Adapt.</div>
  </section></main>;
}

function Nav() { return <nav className="nav"><div className="brand">Abhyas<span>Marg</span></div><div className="pill"><Sparkles size={12} style={{ verticalAlign: "middle" }} /> Autonomous learning agent</div></nav> }
 "use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, BarChart3, BookOpen, BrainCircuit, Check, ChevronRight,
  ClipboardCheck, Clock3, Flame, Home, Lightbulb, Network, Search,
  Settings, Target, Trophy, UserRound, Zap, RotateCcw, Play, Lock,
  CircleCheck, Sparkles
} from "lucide-react";

type Skill = { name: string; score: number };
type Plan = {
  career: string;
  readiness: number;
  summary: string;
  skills: Skill[];
  gaps: { name: string; level: string }[];
  roadmap: [string, string][];
};

const questions = [
  "How comfortable are you with Python?",
  "How well do you understand machine learning fundamentals?",
  "Have you built a deep learning project?",
  "How comfortable are you with LLM APIs and prompt design?",
  "Have you built a RAG or semantic-search application?",
  "How confident are you deploying AI applications?"
];
const options = ["Beginner", "Learning", "Comfortable", "Advanced"];

const fallbackPlan: Plan = {
  career: "GenAI Engineer",
  readiness: 46,
  summary: "Your programming foundation is strong. Your biggest opportunity is moving from using AI APIs to building, evaluating and deploying reliable GenAI systems.",
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
    ["RAG Concepts", "Understand embeddings, semantic search and retrieval."],
    ["RAG Architecture", "Learn chunking, vector databases and retrieval design."],
    ["Fix RAG Pipeline", "Diagnose relevance failures and improve retrieval."],
    ["AI Assessment", "Evaluate retrieval and answer quality with metrics."],
    ["Reflect & Adapt", "Turn assessment evidence into the next best action."]
  ]
};

const initialActivity = [
  ["Profile Agent", "Analyzed your background", "2 min ago"],
  ["Gap Agent", "Identified 4 critical gaps", "3 min ago"],
  ["Learning Agent", "Created personalized path", "3 min ago"],
  ["Assessment Agent", "Challenge ready", "Now"]
];

export default function HomePage() {
  const [screen, setScreen] = useState<"home" | "diagnostic" | "analysis" | "dashboard">("home");
  const [view, setView] = useState("Dashboard");
  const [goal, setGoal] = useState("GenAI Engineer");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [memory, setMemory] = useState([
    "Strong Python foundation",
    "Needs hands-on RAG practice",
    "Learns best through build-first tasks",
    "Career target: GenAI Engineer"
  ]);
  const [activity, setActivity] = useState(initialActivity);

  const displayPlan = plan ?? { ...fallbackPlan, career: goal };

  const readiness = useMemo(() => {
    if (!completed) return displayPlan.readiness;
    return Math.min(100, displayPlan.readiness + 8);
  }, [completed, displayPlan.readiness]);

  const startJourney = () => {
    setScreen("diagnostic");
    setQuestionIndex(0);
    setAnswers([]);
    setSelected("");
    setPlan(null);
    setEvaluation(null);
    setCompleted(false);
  };

  const chooseAnswer = (value: string) => {
    setSelected(value);
    setTimeout(async () => {
      const updated = [...answers, value];
      setAnswers(updated);

      if (questionIndex < questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setSelected("");
        return;
      }

      setScreen("analysis");
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, answers: updated })
        });
        const data = await response.json();
        setPlan(data);
      } catch {
        setPlan({ ...fallbackPlan, career: goal });
      }
      setTimeout(() => setScreen("dashboard"), 1300);
    }, 160);
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) return;
    setBusy(true);
    setActivity(prev => [["Assessment Agent", "Evaluating your solution", "Just now"], ...prev]);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer })
      });
      const data = await response.json();
      setEvaluation(data);
    } catch {
      setEvaluation({
        score: 74,
        verdict: "Good reasoning. Separate retrieval quality from final answer quality and prove the fix with metrics.",
        strengths: [
          "Identified retrieval as the likely failure point.",
          "Focused on measuring the quality of the fix."
        ],
        improve: [
          "Add Recall@K or MRR.",
          "Create a labelled evaluation set.",
          "Measure retrieval separately from generation."
        ]
      });
    }
    setBusy(false);
  };

  const completeChallenge = () => {
    setCompleted(true);
    setChallengeStarted(false);
    setMemory(prev => ["RAG competency improved from 12% → 27%", ...prev]);
    setActivity(prev => [["Memory Agent", "Updated your learning path", "Just now"], ...prev]);
    setView("Progress");
  };

  const navigate = (name: string) => {
    if (name === "Dashboard") {
      setScreen("dashboard");
      setView(name);
      return;
    }
    if (screen !== "dashboard") setScreen("dashboard");
    setView(name);
  };

  if (screen === "home") {
    return (
      <Shell active="Dashboard" navigate={navigate}>
        <div className="landing">
          <div className="landing-copy">
            <label>AI CAREER-TO-MASTERY AGENT</label>
            <h1>Turn <em>ambition</em><br />into mastery.</h1>
            <p>
              Tell AbhyasMarg where you want to go. Our learning agents
              diagnose what you know, find what you are missing and decide
              what you should do next.
            </p>
            <div className="goal">
              <small>MY CAREER GOAL</small>
              <div className="goal-input">
                <Target size={20} />
                <input value={goal} onChange={e => setGoal(e.target.value)} />
              </div>
              <button onClick={startJourney}>Start my journey <ArrowRight size={16} /></button>
            </div>
            <div className="trust-row">
              <span><BrainCircuit size={14} /> Diagnose</span>
              <span><Network size={14} /> Map gaps</span>
              <span><BookOpen size={14} /> Learn</span>
              <span><ClipboardCheck size={14} /> Evaluate</span>
              <span><RotateCcw size={14} /> Adapt</span>
            </div>
          </div>
          <NeuronHero />
        </div>
      </Shell>
    );
  }

  if (screen === "diagnostic") {
    return (
      <Shell active="My Journey" navigate={navigate}>
        <main className="narrow">
          <label>DIAGNOSTIC • {questionIndex + 1}/{questions.length}</label>
          <div className="progress"><i style={{ width: `${(questionIndex / questions.length) * 100}%` }} /></div>
          <section className="card diagnostic-card">
            <div className="target-line"><Target size={15} /> Target career: <b>{goal}</b></div>
            <h1>{questions[questionIndex]}</h1>
            <p>Be honest — AbhyasMarg uses this to personalize your starting point.</p>
            <div className="options">
              {options.map(option => (
                <button className={selected === option ? "selected" : ""} onClick={() => chooseAnswer(option)} key={option}>
                  <span>{option}</span><ArrowRight size={15} />
                </button>
              ))}
            </div>
          </section>
        </main>
      </Shell>
    );
  }

  if (screen === "analysis") {
    return (
      <Shell active="My Journey" navigate={navigate}>
        <div className="analysis">
          <div className="pulse"><BrainCircuit size={52} /></div>
          <label>ABHYASMARG IS THINKING</label>
          <h1>Building your path to <em>{goal}</em></h1>
          {[
            ["Profile Agent", "Analyzed your background", UserRound],
            ["Career Agent", "Mapped role requirements", Target],
            ["Gap Agent", "Identified critical gaps", Search],
            ["Learning Agent", "Created personalized path", BookOpen],
            ["Assessment Agent", "Prepared your first challenge", ClipboardCheck]
          ].map(([title, description, Icon]: any) => (
            <div className="agent" key={title}>
              <span><Icon size={16} /></span>
              <div><b>{title}</b><small>{description}</small></div>
              <Check size={16} />
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  const dashboard = (
    <>
      <div className="welcome">
        <div>
          <label>YOUR LEARNING COMMAND CENTER</label>
          <h1>Welcome back, Sandipan! 👋</h1>
          <p>Let’s advance your career journey today.</p>
        </div>
        <div className="stats">
          <div><Target /><small>Career Goal</small><b>{displayPlan.career}</b></div>
          <div><Flame /><small>Day Streak</small><b>7 days</b></div>
          <div><Trophy /><small>XP Earned</small><b>{completed ? "580" : "460"} XP</b></div>
        </div>
      </div>

      <div className="grid">
        <div className="main">
          <section className="card loop-card">
            <div className="head">
              <div><h2>Agentic Learning Loop</h2><p>Five agents continuously working together for your growth</p></div>
              <span className="live">● LIVE</span>
            </div>
            <div className="loop">
              {[
                [UserRound, "Profile Agent", "Understands your profile"],
                [Target, "Career Agent", "Maps target skills"],
                [Search, "Gap Agent", "Identifies skill gaps"],
                [BookOpen, "Learning Agent", "Builds your path"],
                [ClipboardCheck, "Assessment Agent", "Evaluates & adapts"]
              ].map(([Icon, name, description], index) => (
                <div className="loopitem" key={name as string}>
                  <div className="node"><Icon size={23} /></div>
                  <b>{name as string}</b>
                  <small>{description as string}</small>
                  {index < 4 && <i />}
                </div>
              ))}
            </div>
            <div className="caption"><RotateCcw size={14} /> Continuously adapts to your progress</div>
          </section>

          <div className="three">
            <section className="card readiness">
              <h3>Career Readiness Score</h3>
              <div className="ring" style={{ background: `conic-gradient(#efbd29 ${readiness * 3.6}deg, #27261e ${readiness * 3.6}deg)` }}>
                <div><strong>{readiness}%</strong><small>{completed ? "Updated after challenge" : "Not there yet,\nbut you’re on the\nright path!"}</small></div>
              </div>
              <p>🧠 {completed ? "Your performance changed your path." : "Consistency is the key."}</p>
            </section>

            <section className="card">
              <h3>Skill Competency <small>(Current)</small></h3>
              {displayPlan.skills.map((skill, index) => {
                const score = completed && skill.name === "RAG" ? 27 : skill.score;
                return (
                  <div className="skill" key={skill.name}>
                    <span>{skill.name}</span><b>{score}%</b>
                    <div><i style={{ width: `${score}%` }} /></div>
                  </div>
                );
              })}
            </section>

            <section className="card update">
              <h3>Learning Adaptation</h3>
              <div className="ba">
                <span>RAG <b>12%</b><small>Before</small></span>
                <strong>→</strong>
                <span className="after">RAG <b>27%</b><small>After</small></span>
              </div>
              <big>+15%</big>
              <p>{completed ? "Challenge evidence changed your competency." : "Complete today's challenge to update this."}</p>
              <aside><BrainCircuit size={16} /> Path automatically adapts to evidence.</aside>
            </section>
          </div>

          <section className="card">
            <div className="head"><h2>Today’s Personalized Path</h2><span className="pill">Generated for you</span></div>
            <div className="path">
              {displayPlan.roadmap.slice(0, 5).map((item, index) => (
                <div className={index === 2 ? "active" : ""} key={index}>
                  <div className="path-top">{index + 1}</div>
                  <b>{["Learn", "Watch", "Practice", "Evaluate", "Reflect"][index]}</b>
                  <span>{item[0]}</span>
                  <small>{index === 2 ? "30 mins" : "15 mins"}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="card mission">
            <div className="mission-head">
              <div><label>TODAY’S MISSION</label><h2>Fix a Broken RAG Pipeline</h2><p>Debug the retrieval system and prove that your fix improves context quality.</p></div>
              <div className="mission-icon"><Zap /></div>
            </div>
            {!challengeStarted && !evaluation && (
              <button onClick={() => setChallengeStarted(true)}><Play size={15} /> Start Challenge <ArrowRight size={15} /></button>
            )}
            {challengeStarted && !evaluation && (
              <>
                <div className="challenge-box">
                  <b>Scenario</b>
                  <p>Your RAG application retrieves irrelevant chunks even when the correct document exists. Explain what you would inspect first, what changes you would make, and how you would prove the fix worked.</p>
                  <div className="challenge-hints"><span>Retrieval</span><span>Chunking</span><span>Evaluation</span></div>
                </div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your approach..." />
                <button onClick={evaluateAnswer} disabled={busy || !answer.trim()}>
                  {busy ? "Assessment Agent evaluating…" : "Submit for AI evaluation"} <ArrowRight size={15} />
                </button>
              </>
            )}
            {evaluation && (
              <div className="evaluation">
                <label>ASSESSMENT AGENT</label>
                <div className="eval-row"><big>{evaluation.score}/100</big><span>Evidence-based assessment complete</span></div>
                <p>{evaluation.verdict}</p>
                <div className="feedback-grid">
                  <div><b>Strengths</b>{evaluation.strengths?.map((x: string) => <span key={x}>✓ {x}</span>)}</div>
                  <div><b>Next improvements</b>{evaluation.improve?.map((x: string) => <span key={x}>→ {x}</span>)}</div>
                </div>
                <button onClick={completeChallenge}><CircleCheck size={15} /> Apply learning update</button>
              </div>
            )}
          </section>
        </div>

        <aside className="side">
          <section className="card mission-side">
            <h3><Sparkles size={15} /> Today’s Mission</h3>
            <h2>Fix a Broken RAG Pipeline</h2>
            <p>Debug retrieval quality, defend your reasoning and earn evidence for your skill graph.</p>
            <button onClick={() => { setChallengeStarted(true); setView("Dashboard"); }}><Play size={14} /> Start Challenge</button>
            <footer><span><Clock3 size={12} /> 30 min</span><b>+120 XP</b></footer>
          </section>

          <section className="card activity">
            <h3>Agent Activity <span className="live">● LIVE</span></h3>
            {activity.slice(0, 5).map(([name, text, time], index) => (
              <div key={`${name}-${index}`}>
                <span>{index === 0 ? "◉" : index === 1 ? "⌕" : index === 2 ? "▣" : "☑"}</span>
                <p><b>{name}</b><small>{text}</small></p>
                <small>{time}</small>
              </div>
            ))}
          </section>

          <section className="card achievements">
            <h3>Recent Achievements <small>View All</small></h3>
            <p>🏆 Completed Prompt Engineering Basics <b>+100 XP</b></p>
            <p>🔥 7 Day Streak <b>+60 XP</b></p>
            {completed && <p>🧠 RAG Recovery Challenge <b>+120 XP</b></p>}
          </section>
        </aside>
      </div>
    </>
  );

  const skillGraph = (
    <section className="full-view">
      <div className="section-title"><label>COMPETENCY GRAPH</label><h1>Your Skill Graph</h1><p>AbhyasMarg keeps a living model of what you can actually do.</p></div>
      <div className="graph-layout">
        <section className="card brain-graph">
          <div className="graph-core"><BrainCircuit size={55} /><b>{readiness}%</b><small>Career readiness</small></div>
          {displayPlan.skills.map((s, i) => {
            const angles = [0, 60, 120, 180, 240, 300];
            return <div key={s.name} className="graph-node" style={{ transform: `rotate(${angles[i]}deg) translateX(155px) rotate(-${angles[i]}deg)` }}>
              <span style={{ opacity: 0.5 + s.score / 200 }}>{s.score}%</span><b>{s.name}</b>
            </div>;
          })}
          <div className="graph-lines" />
        </section>
        <section className="card"><h2>Priority gaps</h2>{displayPlan.gaps.map(g => <div className="gap-row" key={g.name}><span className={g.level === "Critical" ? "critical" : "high"}>{g.level}</span><b>{g.name}</b><ChevronRight size={15} /></div>)}<div className="insight"><Lightbulb size={17}/><span>The agent prioritizes gaps by career impact, not course popularity.</span></div></section>
      </div>
    </section>
  );

  const journey = (
    <section className="full-view">
      <div className="section-title"><label>YOUR JOURNEY</label><h1>{displayPlan.career}</h1><p>{displayPlan.summary}</p></div>
      <div className="journey-grid">
        {displayPlan.roadmap.concat([["Capstone", "Build and defend a production-ready GenAI project."]]).map((item, i) => (
          <div className={`journey-card ${i < 2 ? "done" : i === 2 ? "current" : ""}`} key={i}>
            <div className="journey-number">{i < 2 ? <Check size={16}/> : i + 1}</div><div><small>STEP {i + 1}</small><h3>{item[0]}</h3><p>{item[1]}</p></div>{i > 2 && <Lock size={15}/>}
          </div>
        ))}
      </div>
    </section>
  );

  const progress = (
    <section className="full-view">
      <div className="section-title"><label>PROGRESS</label><h1>Your growth, in evidence.</h1><p>Progress is based on demonstrated ability, not time spent.</p></div>
      <div className="progress-grid">
        <section className="card big-progress"><small>CAREER READINESS</small><strong>{readiness}%</strong><div className="wide-bar"><i style={{width: `${readiness}%`}} /></div><p>{completed ? "+8 points from your RAG challenge" : "Complete a challenge to generate new evidence."}</p></section>
        <section className="card"><h2>Evidence collected</h2><div className="evidence"><span><Check/> Diagnostic</span><span><Check/> RAG reasoning</span><span><Check/> Retrieval evaluation</span><span><Lock/> Deployment evidence</span></div></section>
      </div>
      <section className="card timeline"><h2>Learning timeline</h2>{activity.slice(0, 5).map((a, i) => <div key={i}><span>{i + 1}</span><b>{a[0]}</b><p>{a[1]}</p><small>{a[2]}</small></div>)}</section>
    </section>
  );

  const memoryView = (
    <section className="full-view">
      <div className="section-title"><label>AGENT MEMORY</label><h1>What AbhyasMarg remembers.</h1><p>The system uses learning evidence to personalize future actions.</p></div>
      <div className="memory-layout">
        <section className="card memory-brain"><BrainCircuit size={90}/><strong>Learning memory</strong><small>Continuously updated</small></section>
        <section className="card"><h2>Student memory</h2>{memory.map((m, i) => <div className="memory-row" key={`${m}-${i}`}><BrainCircuit size={15}/><span>{m}</span><small>active</small></div>)}<button onClick={() => setMemory(prev => [...prev, "Prefers practical, challenge-based learning"])}>+ Add learning preference</button></section>
      </div>
    </section>
  );

  return (
    <Shell active={view} navigate={navigate}>
      {view === "Dashboard" && dashboard}
      {view === "My Journey" && journey}
      {view === "Skill Graph" && skillGraph}
      {view === "Learning Path" && journey}
      {view === "Challenges" && <section className="full-view"><div className="section-title"><label>CHALLENGES</label><h1>Practice what matters.</h1><p>Challenges are generated from your highest-impact gaps.</p></div>{dashboard}</section>}
      {view === "Progress" && progress}
      {view === "Agent Memory" && memoryView}
      {view === "Settings" && <section className="full-view"><div className="section-title"><label>SETTINGS</label><h1>Your learning preferences.</h1></div><section className="card settings-card"><div><b>Adaptive difficulty</b><span>Automatically increase challenge difficulty as competency improves.</span></div><div className="toggle on">ON</div><div><b>Evidence-based roadmap</b><span>Prioritize demonstrated skills over completed courses.</span></div><div className="toggle on">ON</div></section></section>}
    </Shell>
  );
}

function Shell({ children, active, navigate }: { children: React.ReactNode; active: string; navigate: (name: string) => void }) {
  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div><BrainCircuit /></div><section><b>AbhyasMarg</b><small>AI-Powered<br/>Learning Companion</small></section></div>
      <nav>
        {[
          ["Dashboard", Home], ["My Journey", Network], ["Skill Graph", Network],
          ["Learning Path", BookOpen], ["Challenges", Trophy], ["Progress", BarChart3],
          ["Agent Memory", BrainCircuit], ["Settings", Settings]
        ].map(([name, Icon]: any) => <button className={active === name ? "active" : ""} key={name} onClick={() => navigate(name)}><Icon size={19}/>{name}</button>)}
      </nav>
      <blockquote>“Neurons that fire together,<br/>wire together.”<small>— Hebb</small></blockquote>
      <div className="user"><div>S</div><span><b>Sandipan Mandal</b><small>Keep going! 🚀</small></span></div>
    </aside>
    <div className="content">
      <header><span>Smart Education</span><div>S</div></header>
      {children}
    </div>
  </div>;
}

function NeuronHero() {
  return <div className="neuron"><div className="core"><BrainCircuit size={75}/></div>{Array.from({length:16}).map((_, i) => <i key={i} className={`nn n${i}`}/>)}{Array.from({length:8}).map((_, i) => <b key={i} className={`branch br${i}`}/>)}</div>;
}

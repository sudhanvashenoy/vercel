// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Terminal, Code, BookOpen, ChevronRight, Search,
  ShieldCheck, Layout, Users, Database, GlobeLock,
  Send, Lock, Server, Mail, CheckCircle, Monitor,
  Activity, Command, FileText, Cpu, MousePointer2,
  Plus, AlertCircle, FolderTree, AlignLeft, Building2,
  Zap, MessageSquare, Hash, ArrowRight, Sparkles,
  Layers, Folder, File, CheckSquare, ListOrdered,
  Star, Quote, TrendingUp, Clock, Globe, Shield,
  ChevronDown, Play, Pause, BarChart3, GitBranch,
  Webhook, Puzzle, RefreshCw, Eye, Bell, Workflow
} from 'lucide-react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const typeText = async (text: string, setter: (val: string) => void, speed = 30) => {
  let current = '';
  for (let i = 0; i < text.length; i++) {
    current += text[i];
    setter(current);
    await sleep(speed);
  }
};

// Animated counter hook
function useCounter(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, start, duration]);
  return { count, ref };
}

// Particle background — seeded deterministically to avoid SSR/client mismatch
function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Deterministic pseudo-random using index as seed (no Math.random on server)
  const particles = Array.from({ length: 35 }, (_, i) => {
    const s1 = ((i * 9301 + 49297) % 233280) / 233280;
    const s2 = (((i + 7) * 9301 + 49297) % 233280) / 233280;
    const s3 = (((i + 13) * 6271 + 49297) % 233280) / 233280;
    const s4 = (((i + 3) * 8121 + 28411) % 134456) / 134456;
    const s5 = (((i + 17) * 7321 + 49297) % 233280) / 233280;
    return {
      id: i,
      x: s1 * 100,
      y: s2 * 100,
      size: s3 * 2 + 0.5,
      delay: s4 * 8,
      duration: s5 * 10 + 8,
    };
  });

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.6, 0], y: [-20, -80, -140] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

// Stat Card
function StatCard({ end, suffix, label, prefix }: { end: number, suffix?: string, label: string, prefix?: string }) {
  const { count, ref } = useCounter(end);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

// Testimonials data
const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP Engineering, NexusCorp",
    avatar: "SC",
    color: "from-purple-500 to-blue-500",
    text: "DevNote replaced 4 different tools we were using. Our onboarding time dropped by 60%. Engineers stop bothering each other every 5 minutes now.",
    stars: 5
  },
  {
    name: "Marcus O'Brien",
    role: "Head of IT, SecureNet",
    avatar: "MO",
    color: "from-blue-500 to-cyan-500",
    text: "The RBAC system is outstanding. Our compliance team can finally sleep at night knowing SOC-2 policies are actually versioned and auditable.",
    stars: 5
  },
  {
    name: "Priya Nair",
    role: "CTO, DataFlow Systems",
    avatar: "PN",
    color: "from-pink-500 to-purple-500",
    text: "We tried Notion, Confluence, and GitBook. Nothing came close to what DevNote offers for technical teams at our scale. The semantic search is magic.",
    stars: 5
  }
];

// Integration logos
const integrations = [
  { name: "GitHub", icon: GitBranch, color: "text-gray-300" },
  { name: "Slack", icon: MessageSquare, color: "text-green-400" },
  { name: "Okta", icon: ShieldCheck, color: "text-blue-400" },
  { name: "Jira", icon: Workflow, color: "text-blue-500" },
  { name: "AWS", icon: Server, color: "text-orange-400" },
  { name: "Webhooks", icon: Webhook, color: "text-purple-400" },
  { name: "REST API", icon: Code, color: "text-cyan-400" },
  { name: "SSO/SAML", icon: Lock, color: "text-pink-400" },
];

// Workflow steps
const workflowSteps = [
  { icon: FileText, step: "01", title: "Write & Structure", desc: "Create rich docs with MDX, code blocks, callouts, and embeds. Organize into nested workspaces your way.", color: "purple" },
  { icon: Users, step: "02", title: "Assign Access", desc: "Set granular RBAC at workspace, folder, or document level. Sync roles from Okta, Azure AD, or Google.", color: "blue" },
  { icon: Globe, step: "03", title: "Publish to Edge", desc: "Docs deploy globally across 35+ PoPs instantly. Every update live in under 200ms, no manual steps.", color: "cyan" },
  { icon: Search, step: "04", title: "Find in Milliseconds", desc: "Semantic search with Cmd+K. Natural language queries return the right doc from 100K+ articles instantly.", color: "green" },
];

// Cinematic story animation component
function StoryAnimation() {
  const [scene, setScene] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Scene progression: 0=before chaos, 1=writing, 2=sending, 3=chaos/search, 4=devnote, 5=resolved
  useEffect(() => {
    if (!inView) return;
    const timings = [0, 2200, 4200, 6200, 8400, 10600];
    const timers = timings.map((t, i) => setTimeout(() => setScene(i), t));
    // Loop
    const loopTimer = setTimeout(() => { setScene(0); }, 13500);
    return () => { timers.forEach(clearTimeout); clearTimeout(loopTimer); };
  }, [inView]);

  // Re-trigger loop
  useEffect(() => {
    if (!inView || scene !== 0) return;
    const timings = [2200, 4200, 6200, 8400, 10600];
    const timers = timings.map((t, i) => setTimeout(() => setScene(i + 1), t));
    const loopTimer = setTimeout(() => setScene(0), 13500);
    return () => { timers.forEach(clearTimeout); clearTimeout(loopTimer); };
  }, [scene, inView]);

  const members = [
    { id: 'AK', color: 'from-purple-500 to-blue-500', name: 'Arjun K.', role: 'Eng Lead' },
    { id: 'SP', color: 'from-blue-500 to-cyan-500', name: 'Sara P.', role: 'Backend Dev' },
    { id: 'MR', color: 'from-pink-500 to-purple-500', name: 'Mike R.', role: 'DevOps' },
    { id: 'JL', color: 'from-orange-400 to-pink-500', name: 'Jen L.', role: 'New Hire' },
  ];

  const sceneLabel = ['The chaos begins...', 'Arjun writes the deploy guide', 'Shared to Slack...', 'Months later — chaos strikes', 'DevNote to the rescue', 'Found instantly. Problem solved.'][scene] ?? '';

  return (
    <section id="features" className="py-32 bg-[#050505] px-6 relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.07),transparent_60%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> See It In Action
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">From scattered chaos<br/>to instant clarity.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Watch how a real team goes from knowledge bottlenecks to frictionless information flow — with DevNote.</p>
        </div>

        <div ref={ref} className="relative max-w-5xl mx-auto">
          {/* Scene label */}
          <div className="text-center mb-8 h-7">
            <AnimatePresence mode="wait">
              <motion.span key={scene} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="text-sm font-bold text-purple-400 uppercase tracking-widest">
                {sceneLabel}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Main stage */}
          <div className="relative bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden" style={{ minHeight: 520 }}>
            {/* Scene: 0 — Team overview with chaos */}
            <AnimatePresence mode="wait">
              {scene === 0 && (
                <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
                  className="absolute inset-0 p-10 flex flex-col items-center justify-center">
                  <div className="text-center mb-10">
                    <div className="text-2xl font-bold text-white mb-2">A 4-person team. Growing fast.</div>
                    <div className="text-gray-500">Everyone stores knowledge in different places.</div>
                  </div>
                  <div className="flex items-end gap-8 justify-center">
                    {members.map((m, i) => (
                      <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                        className="flex flex-col items-center gap-3">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-lg font-black text-white shadow-lg`}>{m.id}</div>
                        <div className="text-xs font-bold text-white">{m.name}</div>
                        <div className="text-[10px] text-gray-500">{m.role}</div>
                        {/* Each person has scattered docs */}
                        <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                          className="flex flex-col gap-1 mt-2">
                          {['Notion', 'Drive', 'Slack'][i % 3] && (
                            <div className="text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded font-mono">{['Notion', 'Drive', 'Slack', 'Email'][i]}</div>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Chaos lines between people */}
                  <div className="mt-8 flex flex-col gap-2 w-full max-w-md">
                    {['Where is the deploy doc?', 'Check Notion... or was it Drive?', 'I just sent it on Slack last month 😅'].map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.3 }}
                        className="flex items-center gap-3 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl">
                        <Hash className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="text-xs text-gray-400">{msg}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Scene 1: Arjun writes doc */}
              {scene === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex">
                  <div className="w-56 bg-[#050505] border-r border-white/5 p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-black text-white">AK</div>
                      <div>
                        <div className="text-xs font-bold text-white">Arjun K.</div>
                        <div className="text-[10px] text-gray-500">Engineering Lead</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Folder className="w-3.5 h-3.5 text-blue-400" /><span className="text-xs text-gray-200 font-medium">Engineering</span>
                      </div>
                      <div className="pl-4 border-l border-white/5 ml-2 space-y-1">
                        <div className="flex items-center gap-2 py-1"><File className="w-3 h-3 text-purple-400" /><span className="text-xs text-white font-semibold">Deploy Guide</span>
                          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-black text-white">AK</div>
                      <div className="text-sm text-gray-400">Arjun is writing <span className="text-white font-semibold">Production Deploy Guide</span></div>
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="ml-auto text-xs text-purple-400 font-mono">● LIVE</motion.div>
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-4">Production Deploy Guide</div>
                    <div className="space-y-4 flex-1">
                      {[
                        { n: 1, color: 'purple', title: 'Run CI/CD checks', detail: 'Ensure all pipelines pass before touching prod.' },
                        { n: 2, color: 'blue', title: 'Authenticate to cluster', detail: 'aws sso login --profile prod-admin' },
                        { n: 3, color: 'cyan', title: 'Deploy with zero downtime', detail: 'kubectl rollout restart deployment/api' },
                      ].map((step, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.4 }}
                          className="flex gap-4">
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold
                            ${step.color === 'purple' ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400' :
                              step.color === 'blue' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400' :
                              'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400'}`}>{step.n}</div>
                          <div>
                            <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                            <div className="text-xs text-gray-500 font-mono">{step.detail}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="mt-6 self-end px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-bold text-white flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                      <Send className="w-4 h-4" /> Publish to Engineering
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Scene 2: Sending / published to team */}
              {scene === 2 && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-10 gap-8">
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-white mb-2">Published to DevNote</div>
                    <div className="text-gray-400">Available to the Engineering workspace instantly</div>
                  </div>
                  {/* Notification cards flying to members */}
                  <div className="flex gap-6 flex-wrap justify-center">
                    {members.map((m, i) => (
                      <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.2 }}
                        className="flex items-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-purple-500/20 rounded-xl">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center text-xs font-black text-white`}>{m.id}</div>
                        <div>
                          <div className="text-xs font-bold text-white">{m.name}</div>
                          <div className="text-[10px] text-green-400 flex items-center gap-1"><Bell className="w-2.5 h-2.5" /> Notified</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Scene 3: 6 months later — chaos again (new hire struggling) */}
              {scene === 3 && (
                <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-10 flex flex-col items-center justify-center gap-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-base font-black text-white">JL</div>
                    <div>
                      <div className="text-lg font-extrabold text-white">Jen L.</div>
                      <div className="text-sm text-gray-500">New Hire — Day 3 on the job</div>
                    </div>
                  </div>
                  <div className="w-full max-w-lg space-y-3">
                    {[
                      { platform: 'Slack', msg: 'Hey Arjun! Where is the deploy guide?', delay: 0.2, icon: MessageSquare, color: 'text-green-400' },
                      { platform: 'Slack', msg: 'Arjun is away until Monday 🏖️', delay: 0.6, icon: AlertCircle, color: 'text-red-400' },
                      { platform: 'Email', msg: 'RE: RE: Deploy process — see attachment? (404 broken link)', delay: 1.0, icon: Mail, color: 'text-blue-400' },
                      { platform: 'Google Drive', msg: 'You need to request access to this file...', delay: 1.4, icon: Lock, color: 'text-yellow-400' },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay }}
                        className="flex items-start gap-3 px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                        <item.icon className={`w-4 h-4 ${item.color} shrink-0 mt-0.5`} />
                        <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-0.5">{item.platform}</div>
                          <div className="text-xs text-gray-300">{item.msg}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm text-red-400 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> 2 hours wasted. Still no answer.
                  </motion.div>
                </motion.div>
              )}

              {/* Scene 4: DevNote saves the day */}
              {scene === 4 && (
                <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-10 gap-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-sm font-black text-white">JL</div>
                      <span className="text-gray-400 text-sm">opens DevNote and types...</span>
                    </div>
                  </div>
                  {/* Search bar */}
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-xl bg-[#111] border border-purple-500/30 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Search className="w-5 h-5 text-purple-400" />
                    <SearchTyping />
                    <div className="text-xs font-mono text-gray-600 bg-black px-2 py-1 rounded border border-white/5">⌘K</div>
                  </motion.div>
                  {/* Processing */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="flex items-center gap-2 text-xs text-gray-500">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    </motion.div>
                    Semantic engine searching 12,483 documents...
                  </motion.div>
                </motion.div>
              )}

              {/* Scene 5: Result found instantly */}
              {scene === 5 && (
                <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex">
                  <div className="w-56 bg-[#050505] border-r border-white/5 p-5 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs font-black text-white">JL</div>
                      <div>
                        <div className="text-xs font-bold text-white">Jen L.</div>
                        <div className="text-[10px] text-green-400">● Found it!</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
                        <Folder className="w-3.5 h-3.5 text-blue-400" /><span className="text-xs text-gray-400">Engineering</span>
                      </div>
                      <div className="pl-4 border-l border-white/5 ml-2 space-y-1">
                        <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-green-500/10 border border-green-500/20">
                          <File className="w-3 h-3 text-green-400" /><span className="text-xs text-green-300 font-semibold">Deploy Guide</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto text-center">
                      <div className="text-[10px] text-gray-600 mb-1">Result found in</div>
                      <div className="text-2xl font-black text-green-400">12ms</div>
                    </div>
                  </div>
                  <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                      <div className="text-sm text-gray-400">Engineering / <span className="text-white font-semibold">Deploy Guide</span></div>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">Published</div>
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-white mb-4">Production Deploy Guide</div>
                    <div className="space-y-3 mb-6">
                      {['Run CI/CD checks', 'Authenticate to cluster', 'Deploy with zero downtime'].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="text-sm text-gray-300">{s}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                      className="p-4 rounded-xl bg-green-500/5 border border-green-500/15 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-sm font-black text-white shrink-0">JL</div>
                      <div>
                        <div className="text-sm font-bold text-white">Jen deployed successfully 🚀</div>
                        <div className="text-xs text-green-400">In under 10 minutes, on Day 3. No senior engineer interrupted.</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scene progress dots */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setScene(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === scene ? 'w-8 bg-purple-400' : 'w-1.5 bg-white/10'}`} />
              ))}
            </div>
          </div>

          {/* Bottom caption */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.3 } } }}
            className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[
              { icon: Clock, label: '87% less time', sub: 'finding information' },
              { icon: Users, label: '0 interruptions', sub: 'for senior engineers' },
              { icon: Zap, label: 'Day 1 ready', sub: 'for every new hire' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/5">
                <stat.icon className="w-5 h-5 text-purple-400 mx-auto mb-3" />
                <div className="text-lg font-extrabold text-white mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Typing sub-component for search scene
function SearchTyping() {
  const [text, setText] = useState('');
  useEffect(() => {
    const query = 'production deploy guide';
    let i = 0;
    const t = setInterval(() => {
      setText(query.slice(0, i + 1));
      i++;
      if (i >= query.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);
  return <span className="flex-1 text-white font-medium">{text}<span className="animate-pulse border-r-2 border-purple-400 ml-0.5">&nbsp;</span></span>;
}

export default function DevNoteLandingPage() {
  const [heroPhase, setHeroPhase] = useState('dashboard');
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const runAnimationSequence = async () => {
      while (!isCancelled) {
        setHeroPhase('dashboard'); setTitleText(''); setBodyText('');
        await sleep(2500); if (isCancelled) break;
        setHeroPhase('moving_to_create');
        await sleep(800); if (isCancelled) break;
        setHeroPhase('editor');
        await sleep(500);
        await typeText("Q3 Zero-Trust Network Policy", setTitleText, 35);
        await sleep(300);
        await typeText("All internal nodes must authenticate via the central IAM gateway. No exceptions for staging environments.", setBodyText, 15);
        await sleep(1000); if (isCancelled) break;
        setHeroPhase('publishing');
        await sleep(1500); if (isCancelled) break;
        setHeroPhase('dashboard_updated');
        await sleep(5000);
      }
    };
    runAnimationSequence();
    return () => { isCancelled = true; };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let typingInterval;
    const startTypingLoop = () => {
      if (isCancelled) return;
      const textToType = "How to configure Okta SSO?";
      let currentIndex = 0;
      setSearchQuery(''); setShowResults(false);
      typingInterval = setInterval(() => {
        if (currentIndex <= textToType.length) {
          setSearchQuery(textToType.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setShowResults(true);
          setTimeout(startTypingLoop, 6000);
        }
      }, 60);
    };
    startTypingLoop();
    return () => { isCancelled = true; clearInterval(typingInterval); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-500">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">DevNote<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">.</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="http://localhost:3001" target="_blank" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</a>
            <a href="#contact" className="px-5 py-2 text-sm font-bold text-black bg-white hover:bg-gray-200 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Book a Demo
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section id="platform" className="relative pt-32 pb-20 md:pt-44 md:pb-32 flex flex-col items-center justify-center px-6 border-b border-white/5 overflow-hidden">
        <ParticleField />
        <motion.div animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-40 left-1/4 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid xl:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-left relative z-20">
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-8 tracking-wide uppercase">
              <Sparkles className="w-3 h-3" /> Now with AI-powered answer synthesis
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">knowledge OS</span>{' '}
              for scaling teams.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl font-light">
              DevNote unifies your engineering docs, HR policies, and architecture decisions into one semantic knowledge base. Built for blazing-fast retrieval and enterprise scale.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <a href="#contact" className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Start Deploying <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> See It In Action
              </a>
            </motion.div>
            {/* Social proof row */}
            <motion.div variants={fadeInUp} className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['SC','MO','PN','JD','AB'].map((init, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#030303] flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br ${i%2===0?'from-purple-500 to-blue-500':'from-blue-500 to-cyan-500'}`}>{init}</div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold">2,400+ teams</span> already centralized
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                <span className="text-xs text-gray-500 ml-1">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Graphic */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative hidden xl:block w-full h-[580px]">
            <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col z-10 ring-1 ring-white/5">
              {/* macOS Title Bar */}
              <div className="h-12 bg-[#050505] border-b border-white/5 flex items-center px-4 shrink-0 relative w-full">
                <div className="flex gap-2 absolute left-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                </div>
                <div className="w-full text-center text-xs font-medium text-gray-500 tracking-wide select-none">DevNote Enterprise</div>
              </div>

              <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <div className="w-64 bg-[#050505] border-r border-white/5 flex flex-col p-4">
                  <div className="flex items-center gap-2 mb-8 px-2 mt-2">
                    <div className="w-7 h-7 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"><Layout className="w-3.5 h-3.5 text-white"/></div>
                    <span className="text-sm font-bold text-white tracking-wide">Acme Corp</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Workspaces</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-gray-200 text-sm font-medium"><ShieldCheck className="w-4 h-4 text-purple-400"/> Security</div>
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-500 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"><Code className="w-4 h-4"/> Engineering</div>
                    <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-500 text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"><Users className="w-4 h-4"/> Operations</div>
                  </div>

                  {/* Activity Feed Mini */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Recent</div>
                    <div className="space-y-2">
                      {[{icon: FileText, label: 'IAM Policy', time:'2m'}, {icon: Bell, label: 'Review due', time:'1h'}].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
                          <item.icon className="w-3 h-3 shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <span className="text-gray-600">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3 px-2 py-3 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-bold">JD</div>
                    <div>
                      <div className="text-sm text-gray-200 font-medium">Jane Doe</div>
                      <div className="text-xs text-gray-500">Admin Account</div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col relative bg-[#0a0a0a]">
                  <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                      <ShieldCheck className="w-4 h-4 text-gray-500" /> Security / <span className="text-gray-200">Policies</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-300 ${heroPhase === 'moving_to_create' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105' : 'bg-white/5 text-gray-300'}`}>
                      <Plus className="w-3.5 h-3.5" /> New Policy
                    </div>
                  </div>

                  <div className="flex-1 relative p-8">
                    <AnimatePresence mode="wait">
                      {(heroPhase === 'dashboard' || heroPhase === 'moving_to_create' || heroPhase === 'dashboard_updated') && (
                        <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                          <div className="flex items-center justify-between mb-6">
                            <div className="text-2xl font-bold text-white">Active Policies</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 rounded-lg px-3 py-1.5">
                              <BarChart3 className="w-3 h-3" /> 12 this month
                            </div>
                          </div>
                          {heroPhase === 'dashboard_updated' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-[#0a0a0a] border border-purple-500/20 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20"><ShieldCheck className="w-5 h-5 text-purple-400" /></div>
                                <div>
                                  <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Q3 Zero-Trust Network Policy</div>
                                  <div className="text-xs text-gray-400 mt-1">Published just now by Jane Doe • Mandatory review</div>
                                </div>
                              </div>
                              <div className="text-xs px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full font-bold tracking-wide">ACTIVE</div>
                            </motion.div>
                          )}
                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-white/5 rounded-lg"><FileText className="w-5 h-5 text-gray-400" /></div>
                              <div>
                                <div className="text-sm font-bold text-gray-300">Incident Response Playbook</div>
                                <div className="text-xs text-gray-500 mt-1">Updated 2 days ago • V2.4</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-4">
                              <div className="p-2.5 bg-white/5 rounded-lg"><Server className="w-5 h-5 text-gray-400" /></div>
                              <div>
                                <div className="text-sm font-bold text-gray-300">AWS IAM Role Definitions</div>
                                <div className="text-xs text-gray-500 mt-1">Updated 1 week ago • DevOps Sync</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {(heroPhase === 'editor' || heroPhase === 'publishing') && (
                        <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="absolute inset-0 bg-[#0a0a0a] p-8 flex flex-col">
                          <div className="relative flex items-center">
                            <input 
                              type="text" 
                              readOnly 
                              value={titleText} 
                              className="bg-transparent border-none outline-none text-3xl font-extrabold text-white mb-6 placeholder-gray-500 w-full" 
                              placeholder="Article Title..." 
                            />
                          </div>
                          <div className="text-gray-300 text-[16px] leading-relaxed max-w-lg min-h-[140px] font-light relative">
                            {bodyText}
                            {heroPhase === 'editor' && <span className="animate-[pulse_0.8s_ease-in-out_infinite] inline-block w-[2px] h-[18px] bg-purple-400 ml-1 translate-y-1" />}
                          </div>
                          <div className="mt-auto flex justify-end pt-6 border-t border-white/5">
                            <div className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 ${heroPhase === 'publishing' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] scale-95' : 'bg-white/10 text-gray-400'}`}>
                              {heroPhase === 'publishing' ? <><Activity className="w-4 h-4 animate-spin"/> Publishing to Edge...</> : 'Publish to Security Team'}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Cursor */}
              <motion.div className="absolute z-50 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                initial={{ x: 300, y: 498, opacity: 0 }}
                animate={{
                  opacity: (heroPhase === 'editor' || heroPhase === 'dashboard_updated') ? 0 : 1,
                  x: heroPhase === 'moving_to_create' ? 530 : heroPhase === 'publishing' ? 510 : 300,
                  y: heroPhase === 'moving_to_create' ? 83 : heroPhase === 'publishing' ? 498 : 368,
                  scale: (heroPhase === 'publishing' || heroPhase === 'moving_to_create') ? [1, 0.8, 1] : 1
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <MousePointer2 className="w-6 h-6 fill-white stroke-black stroke-2" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="py-20 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          <StatCard end={2400} suffix="+" label="Teams Using DevNote" />
          <StatCard end={50} suffix="ms" label="Avg. Query Latency" />
          <StatCard end={99} suffix=".99%" label="Uptime SLA" />
          <StatCard end={60} suffix="%" label="Faster Onboarding" />
        </div>
      </section>

      {/* ─── TRUSTED BY MARQUEE ─── */}
      <section className="py-12 bg-[#030303] overflow-hidden relative border-b border-white/5">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#030303] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#030303] to-transparent z-10" />
        <p className="text-center text-xs font-bold tracking-widest text-gray-500 uppercase mb-8">Trusted by scaling engineering & ops teams</p>
        <div className="flex gap-16 items-center w-max opacity-40 grayscale">
          <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="flex gap-16 items-center">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-3 text-2xl font-extrabold"><Zap className="w-7 h-7"/> NexusCorp</div>
                <div className="flex items-center gap-3 text-2xl font-extrabold"><GlobeLock className="w-7 h-7"/> SecureNet</div>
                <div className="flex items-center gap-3 text-2xl font-extrabold"><Cpu className="w-7 h-7"/> CoreTech</div>
                <div className="flex items-center gap-3 text-2xl font-extrabold"><Database className="w-7 h-7"/> DataFlow</div>
                <div className="flex items-center gap-3 text-2xl font-extrabold"><Activity className="w-7 h-7"/> Pulse Systems</div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PROBLEM VS SOLUTION ─── */}
      <section id="problem" className="py-32 bg-[#050505] px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Cost of Chaos<br/><span className="text-gray-600 text-3xl md:text-4xl">vs. The Single Source of Truth</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Engineering time is expensive. Stop wasting it on duplicate questions, outdated PDFs, and fragmented Google Drive folders.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 relative">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#110505] to-[#0a0303] border border-red-500/10 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-red-500/10 rounded-full blur-[100px]" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 right-10 bg-[#1a0f0f] border border-red-500/20 px-4 py-3 rounded-xl text-sm text-gray-300 shadow-2xl backdrop-blur-md flex items-center gap-3 z-0">
                <Hash className="w-4 h-4 text-red-400"/> "Is this API deprecated?"
              </motion.div>
              <div className="relative z-10 pt-20">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 mb-8 border border-red-500/20"><AlertCircle className="w-6 h-6 text-red-400" /></div>
                <h3 className="text-3xl font-bold text-white mb-6">Without DevNote</h3>
                <ul className="space-y-6 relative z-20">
                  <li className="flex items-start gap-4 text-gray-400 leading-relaxed"><span className="text-red-400 mt-1">✗</span> <div><strong className="text-gray-200 font-semibold block">Lost Context.</strong> Endless scrolling through Slack to find 6-month-old architecture decisions that were never documented.</div></li>
                  <li className="flex items-start gap-4 text-gray-400 leading-relaxed"><span className="text-red-400 mt-1">✗</span> <div><strong className="text-gray-200 font-semibold block">Access Bottlenecks.</strong> Cloud docs with broken sharing permissions completely blocking new hires during onboarding.</div></li>
                  <li className="flex items-start gap-4 text-gray-400 leading-relaxed"><span className="text-red-400 mt-1">✗</span> <div><strong className="text-gray-200 font-semibold block">Shoulder Tapping.</strong> A toxic culture of interrupting senior engineers constantly because nothing is centralized.</div></li>
                </ul>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#0a0515] to-[#05030a] border border-purple-500/20 relative overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.1)] flex flex-col justify-between">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
              <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 right-10 bg-[#0a0515]/90 border border-purple-500/30 px-4 py-3 rounded-xl text-sm text-green-400 shadow-2xl backdrop-blur-md flex items-center gap-3 z-0">
                <CheckCircle className="w-4 h-4"/> Found in 12ms globally
              </motion.div>
              <div className="relative z-10 pt-20">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/20 mb-8 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.4)]"><Sparkles className="w-6 h-6 text-purple-400" /></div>
                <h3 className="text-3xl font-bold text-white mb-6">With DevNote</h3>
                <ul className="space-y-6 relative z-20">
                  <li className="flex items-start gap-4 text-gray-300 leading-relaxed"><span className="text-purple-400 mt-1">✓</span> <div><strong className="text-white font-semibold block">Centralized Intelligence.</strong> One instantly searchable hub for all code guidelines, HR protocols, and runbooks.</div></li>
                  <li className="flex items-start gap-4 text-gray-300 leading-relaxed"><span className="text-purple-400 mt-1">✓</span> <div><strong className="text-white font-semibold block">Strict RBAC.</strong> Enterprise-grade role-based access. HR sees HR. Engineering sees Engineering. No leaks.</div></li>
                  <li className="flex items-start gap-4 text-gray-300 leading-relaxed"><span className="text-purple-400 mt-1">✓</span> <div><strong className="text-white font-semibold block">Asynchronous Velocity.</strong> Employees find answers independently, unlocking deep work and extreme productivity.</div></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-32 bg-[#030303] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.05),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <Workflow className="w-3.5 h-3.5" /> Workflow
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">From draft to discovery<br/>in four steps.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">DevNote is designed to disappear into your workflow — not add friction to it.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {workflowSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border
                  ${step.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20' :
                    step.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                    step.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20' :
                    'bg-green-500/10 border-green-500/20'}`}>
                  <step.icon className={`w-5 h-5 ${step.color === 'purple' ? 'text-purple-400' : step.color === 'blue' ? 'text-blue-400' : step.color === 'cyan' ? 'text-cyan-400' : 'text-green-400'}`} />
                </div>
                <div className="text-5xl font-black text-white/5 absolute top-6 right-8 select-none">{step.step}</div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRUCTURED KNOWLEDGE ─── */}
      <section id="knowledge" className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <FolderTree className="w-3.5 h-3.5" /> Infinite Organization
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Structured, step-by-step knowledge.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Build a deep, nested hierarchy of articles, deployment guides, and company policies.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative max-w-5xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-[280px] bg-[#050505] border-r border-white/5 p-6 flex flex-col">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Directory</div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-200 py-2"><Folder className="w-4 h-4 text-blue-400" /> Engineering</div>
                  <div className="pl-6 space-y-1 mt-1 border-l border-white/5 ml-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-1.5 hover:text-white cursor-pointer transition-colors"><File className="w-3.5 h-3.5" /> API Guidelines</div>
                    <div className="flex items-center gap-2 text-sm text-white bg-white/5 py-1.5 px-2 rounded-md font-medium cursor-pointer"><File className="w-3.5 h-3.5 text-purple-400" /> Deployment Steps</div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 py-1.5 hover:text-white cursor-pointer transition-colors"><File className="w-3.5 h-3.5" /> System Architecture</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 py-2 hover:text-white cursor-pointer transition-colors mt-2"><Folder className="w-4 h-4" /> Operations Team</div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 py-2 hover:text-white cursor-pointer transition-colors"><Folder className="w-4 h-4" /> Human Resources</div>
              </div>
            </div>
            <div className="flex-1 bg-[#0a0a0a] p-8 md:p-12 relative">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">Engineering / <span className="text-gray-200">Deployment Steps</span></div>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-full">Published</div>
              </div>
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-6">Production Deployment Guide</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">Follow these steps strictly when pushing updates to the main production cluster. Ensure all CI/CD pipelines have passed before proceeding.</p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Authenticate with the Cluster</h3>
                      <p className="text-sm text-gray-400 mb-3">Use your short-lived AWS SSO credentials to log into the EKS cluster.</p>
                      <div className="bg-[#050505] border border-white/5 rounded-lg p-4 font-mono text-xs text-gray-300 shadow-inner">
                        <span className="text-green-400">$</span> aws sso login --profile prod-admin<br/>
                        <span className="text-green-400">$</span> aws eks update-kubeconfig --name core-prod
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Run Pre-Flight Checks</h3>
                      <p className="text-sm text-gray-400">Ensure no active incidents and verify database replication lag is under 100ms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── OMNI-SEARCH ─── */}
      <section className="py-32 bg-[#030303] px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <Command className="w-3.5 h-3.5" /> Cmd + K Anywhere
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">Don't search.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Just find.</span></h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light max-w-md">Powered by advanced embedding models, our semantic search maps natural language to your technical documentation.</p>
            <ul className="space-y-5">
              {["Sub-50ms latency powered by vector databases.", "Understands technical context, synonyms, and typos.", "Respects granular user permissions at the query level.", "AI answer synthesis — get direct answers, not just links."].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30 shrink-0"><CheckCircle className="w-3.5 h-3.5 text-purple-400" /></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-1 lg:order-2 relative w-full max-w-[600px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20 blur-3xl rounded-3xl" />
            <div className="relative bg-[#0d0d0d]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ring-1 ring-white/5">
              <div className="flex items-center gap-4 px-6 py-6 border-b border-white/5 bg-[#111]">
                <Search className="w-6 h-6 text-gray-500" />
                <div className="flex-1 text-xl font-medium text-white tracking-wide">
                  {searchQuery}<span className="animate-pulse ml-1 border-r-2 border-purple-500">&nbsp;</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-mono bg-black px-3 py-1.5 rounded-md border border-white/5">ESC</div>
              </div>
              <div className="p-4 bg-[#0a0a0a] min-h-[320px]">
                {!showResults ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 py-16">
                    <Cpu className="w-10 h-10 mb-4 opacity-20" />
                    <p className="text-sm font-medium tracking-wide">Semantic engine analyzing...</p>
                  </div>
                ) : (
                  <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-2 mt-2">IT Operations</div>
                    <motion.div variants={fadeInUp} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 cursor-pointer hover:bg-purple-500/15 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 bg-[#050505] rounded-lg border border-white/5 mt-1 shadow-sm"><CheckSquare className="w-5 h-5 text-purple-400" /></div>
                        <div>
                          <h4 className="text-white font-bold mb-1 text-lg">Configuring Okta SAML Integration</h4>
                          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">Step-by-step guide for setting up Identity Provider (IdP) routing, mapping user attributes, and enforcing MFA.</p>
                          <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-gray-400 border border-white/10">sso</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-gray-400 border border-white/10">security</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {/* AI Answer synthesis card */}
                    <motion.div variants={fadeInUp} className="p-4 rounded-xl bg-[#0a0a10] border border-blue-500/20 cursor-pointer hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">AI Answer</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">To configure Okta SSO, navigate to your Okta admin panel, create a new SAML 2.0 application, and paste the DevNote metadata URL...</p>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CINEMATIC STORY ANIMATION ─── */}
      <StoryAnimation />

      {/* ─── INTEGRATIONS ─── */}
      <section id="integrations" className="py-32 bg-[#030303] px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <Puzzle className="w-3.5 h-3.5" /> 50+ Integrations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Plugs into your<br/>existing stack.</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">DevNote speaks your tools' language. Connect in minutes, not weeks.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {integrations.map((int, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/15 transition-all hover:-translate-y-1 flex flex-col items-center gap-3 cursor-pointer group">
                <int.icon className={`w-8 h-8 ${int.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{int.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-2">
              View all integrations <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-32 bg-[#030303] px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Purchase the infrastructure you need to secure your organization's knowledge.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Team Plan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Team Plan</h3>
              <p className="text-sm text-gray-400 mb-6 pb-6 border-b border-white/5">Organizations with 50-100 employees.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> 1 Admin User</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Up to 100 Read/Edit Users</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Up to 50 GB Storage Space</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Basic Security Protections</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Email Support</li>
              </ul>
              <div className="w-full py-4 text-center text-sm font-bold text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer">
                Inquire Plan
              </div>
            </motion.div>

            {/* Business Plan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="p-10 rounded-[2rem] bg-gradient-to-b from-purple-900/20 to-blue-900/10 border border-purple-500/50 flex flex-col relative shadow-[0_0_40px_rgba(168,85,247,0.15)] transform md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full shadow-lg">Recommended</div>
              <h3 className="text-2xl font-bold text-white mb-2">Business Plan</h3>
              <p className="text-sm text-gray-400 mb-6 pb-6 border-b border-white/10">Organizations with 100-200 employees.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-white"><ChevronRight className="w-4 h-4 text-purple-400"/> Up to 5 Admin Users</li>
                <li className="flex items-center gap-3 text-sm text-white"><ChevronRight className="w-4 h-4 text-purple-400"/> Up to 200 Read/Edit Users</li>
                <li className="flex items-center gap-3 text-sm text-white"><ChevronRight className="w-4 h-4 text-purple-400"/> Up to 100 GB Storage Space</li>
                <li className="flex items-center gap-3 text-sm text-white"><ChevronRight className="w-4 h-4 text-purple-400"/> Basic Security Protections</li>
                <li className="flex items-center gap-3 text-sm text-white"><ChevronRight className="w-4 h-4 text-purple-400"/> 24/7 Chat & Email Support</li>
              </ul>
              <div className="w-full py-4 text-center text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-500 transition cursor-pointer shadow-lg shadow-purple-500/25">
                Inquire Plan
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Plan</h3>
              <p className="text-sm text-gray-400 mb-6 pb-6 border-b border-white/5">Large companies over 500+ employees.</p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Everything in Business</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Customized Design & Branding</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Advanced Article Restrictions</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> Custom System Modifications</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><ChevronRight className="w-4 h-4 text-purple-500"/> 24/7 Email, Chat & Calls Support</li>
              </ul>
              <div className="w-full py-4 text-center text-sm font-bold text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer">
                Inquire Plan
              </div>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/10 transition-colors shadow-2xl">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Personal Plan</h4>
              <p className="text-sm text-gray-400">For individual use. Single admin user to manage everything. Up to 10 GB storage.</p>
            </div>
            <div className="px-8 py-3 text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/10 transition cursor-pointer whitespace-nowrap">
              Get Personal
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-32 bg-[#050505] px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold mb-6 tracking-wide uppercase">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.9/5 across 500+ reviews
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Teams that switched<br/>never looked back.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`p-8 rounded-2xl border transition-all ${i === activeTestimonial ? 'bg-white/[0.04] border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'bg-[#0a0a0a] border-white/5'}`}>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />
                <p className="text-gray-300 leading-relaxed mb-8 text-base">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" className="py-32 bg-[#050505] px-6 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Start centralizing today.</h2>
            <p className="text-gray-400 text-xl">Talk to an expert about deployment, migration, and volume pricing.</p>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#0a0a0a] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full bg-[#050505] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input type="email" className="w-full bg-[#050505] border border-white/10 rounded-2xl p-4 pl-14 text-white focus:outline-none focus:border-purple-500/50 transition-colors" placeholder="john@company.com" />
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Size</label>
              <select className="w-full bg-[#050505] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50 appearance-none transition-colors cursor-pointer">
                <option value="1-50">1 - 50 Employees</option>
                <option value="51-200">51 - 200 Employees</option>
                <option value="201-1000">201 - 1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
            <button type="button" className="w-full py-5 text-base font-bold text-black bg-white rounded-2xl hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] mt-4">
              Request Enterprise Demo
            </button>
            <p className="text-center text-xs text-gray-600 mt-6 font-medium">By submitting this form, you agree to our Terms of Service and Privacy Policy.</p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="pt-20 pb-12 bg-[#030303] border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center bg-white/5"><Terminal className="w-4 h-4 text-white" /></div>
              <span className="text-2xl font-bold text-white tracking-tight">DevNote.</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">The single source of truth for scaling engineering and operations teams.</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              <span className="text-xs text-gray-500 ml-2">4.9/5 — 500+ reviews</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 tracking-tight">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Knowledge Base</a></li>
              <li><a href="#" className="hover:text-white transition">Enterprise Security</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 tracking-tight">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 tracking-tight">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Legal & Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white transition">System Status</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">© {new Date().getFullYear()} DevNote Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms</a>
            <a href="#" className="hover:text-gray-400 transition">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

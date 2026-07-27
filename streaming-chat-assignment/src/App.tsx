import { useState, useRef, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}
type Theme = 'girl' | 'boy'

// ─── Flower SVG ───────────────────────────────────────────────────────────────
const FLOWER_COLORS = ['#FF9FC4', '#B9A2F0', '#8FCBEA', '#FFD447', '#6FBE8F']

function Flower({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20" cy="11" rx="7" ry="10"
          fill={color} opacity="0.85"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5.5" fill="#FFE9A8" />
    </svg>
  )
}

// ─── Boy Theme Icon (Hexagon) ─────────────────────────────────────────────────
function HexIcon({ size = 28, color = '#38BDF8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon
        points="20,3 35,11.5 35,28.5 20,37 5,28.5 5,11.5"
        fill={color} opacity="0.9"
      />
      <polygon
        points="20,10 29,15 29,25 20,30 11,25 11,15"
        fill="none" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.6"
      />
      <circle cx="20" cy="20" r="4" fill="#E0F2FE" opacity="0.9" />
    </svg>
  )
}

// ─── Background Decorations ───────────────────────────────────────────────────
const BG_FLOWERS = [
  { top: '5%',  left: '3%',  size: 36, color: FLOWER_COLORS[0], delay: 0 },
  { top: '12%', left: '87%', size: 28, color: FLOWER_COLORS[2], delay: 1.2 },
  { top: '78%', left: '5%',  size: 32, color: FLOWER_COLORS[3], delay: 0.6 },
  { top: '88%', left: '80%', size: 26, color: FLOWER_COLORS[1], delay: 1.8 },
  { top: '40%', left: '91%', size: 22, color: FLOWER_COLORS[4], delay: 0.9 },
  { top: '53%', left: '1%',  size: 24, color: FLOWER_COLORS[2], delay: 0.3 },
  { top: '1%',  left: '44%', size: 22, color: FLOWER_COLORS[3], delay: 1.5 },
  { top: '94%', left: '44%', size: 20, color: FLOWER_COLORS[0], delay: 0.4 },
  { top: '30%', left: '96%', size: 18, color: FLOWER_COLORS[1], delay: 2.1 },
  { top: '65%', left: '94%', size: 20, color: FLOWER_COLORS[0], delay: 0.7 },
]

const BG_HEXES = [
  { top: '4%',  left: '2%',  size: 44, opacity: 0.07, delay: 0 },
  { top: '10%', left: '88%', size: 56, opacity: 0.08, delay: 0.8 },
  { top: '50%', left: '95%', size: 38, opacity: 0.06, delay: 1.4 },
  { top: '75%', left: '3%',  size: 50, opacity: 0.07, delay: 0.4 },
  { top: '88%', left: '85%', size: 42, opacity: 0.09, delay: 1.9 },
  { top: '30%', left: '0%',  size: 34, opacity: 0.05, delay: 1.1 },
  { top: '2%',  left: '48%', size: 30, opacity: 0.06, delay: 0.6 },
  { top: '92%', left: '42%', size: 36, opacity: 0.07, delay: 1.6 },
]

// ─── Smart ChatGPT-Style Response Engine ──────────────────────────────────────
function getSmartResponse(input: string): string {
  const text = input.toLowerCase().trim()

  if (/^(hi|hello|hey|sup|yo|howdy)[\s!?.]*$/.test(text) || text === 'hi' || text === 'hello' || text === 'hey') {
    return "Hello! Great to have you here.\n\nI'm your AI assistant, ready to help with coding questions, explanations, debugging, or just a friendly conversation. What's on your mind?"
  }

  if (/how are you|how r u|how are u|kaise ho|kaisa hai/.test(text)) {
    return "I'm doing excellent, thanks for asking!\n\nAs an AI, I don't experience fatigue or stress — so I'm always at 100% and ready to help. Whether it's debugging a tricky function, explaining a concept, or helping you plan a project, I've got you covered.\n\nWhat would you like to work on today?"
  }

  if (/tired|exhausted|sleepy|burnout|stressed|overwhelmed/.test(text)) {
    return "That's completely understandable — programming and assignments can be genuinely exhausting, especially when you're deep in problem-solving mode.\n\nHere are a few quick recovery tips:\n- Take a 5–10 minute break away from your screen\n- Drink some water or have a light snack\n- Do a quick stretch or walk\n- Try the Pomodoro technique: 25 min focus, 5 min break\n\nYou're doing great. Come back fresh and you'll solve it much faster. What are you working on?"
  }

  if (/react|jsx|component|hook|usestate|useeffect|props|context/.test(text)) {
    return "React is a powerful library — let me help you navigate it.\n\nHere are the core pillars to keep in mind:\n\n**Components** — Everything is a component. Prefer functional components with hooks over class components.\n\n**State & Effects** — Use `useState` for local reactive state and `useEffect` for side effects like data fetching or subscriptions.\n\n**Props & Composition** — Pass data down via props, lift state up when siblings need to share it.\n\n**Performance** — Use `useMemo`, `useCallback`, and `React.memo` to avoid unnecessary re-renders.\n\nWhat specific React problem are you tackling? Share your code and I'll take a look."
  }

  if (/tailwind|css|styling|design|layout|flexbox|grid/.test(text)) {
    return "Tailwind CSS is an excellent choice for rapid, consistent UI development.\n\nSome pro tips:\n\n**Responsive design** — Use breakpoint prefixes like `sm:`, `md:`, `lg:` directly on elements instead of writing media queries.\n\n**Custom values** — Use square bracket notation for one-off values: `w-[342px]`, `text-[#FF6B6B]`.\n\n**Component extraction** — When you find yourself repeating utility groups, extract them into a React component rather than using `@apply`.\n\n**Dark mode** — Add `dark:` variants and toggle via the `dark` class on `<html>`.\n\nWhat are you building? I can help you craft the exact class string."
  }

  if (/typescript|ts|type error|interface|generic|type|any/.test(text)) {
    return "TypeScript adds a powerful layer of safety to your JavaScript — here's how to think about it:\n\n**Interfaces vs Types** — Use `interface` for object shapes (especially when you want extensibility), and `type` for unions, intersections, or primitives.\n\n**Generics** — They let you write reusable, type-safe functions. Example: `function identity<T>(arg: T): T { return arg }`.\n\n**Strict mode** — Always enable `strict: true` in your `tsconfig.json`. It catches null/undefined bugs early.\n\n**Avoid `any`** — Use `unknown` when the type is genuinely unknown, then narrow it with type guards.\n\nPaste your type error or code snippet and I'll help you resolve it."
  }

  if (/api|fetch|axios|async|await|promise|http|rest|endpoint/.test(text)) {
    return "Working with APIs is a fundamental skill. Here's a clean async/await pattern:\n\n```ts\nasync function fetchData<T>(url: string): Promise<T> {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json() as Promise<T>;\n}\n```\n\n**Key best practices:**\n- Always handle errors with try/catch or `.catch()`\n- Show loading and error states in your UI\n- Use `AbortController` to cancel stale requests\n- Consider React Query or SWR for caching and background refetching\n\nWhat API are you integrating? I can help you write the integration code."
  }

  if (/debug|error|bug|not working|broken|fix|issue|problem/.test(text)) {
    return "Let's debug this systematically.\n\nA solid debugging workflow:\n\n1. **Read the error message carefully** — the stack trace usually pinpoints the exact file and line\n2. **Isolate the problem** — comment out code until it works, then add back incrementally\n3. **Check your data** — add `console.log` at each step to verify values match your expectations\n4. **Check the Network tab** — if it's an API issue, inspect the request/response in DevTools\n5. **Search the exact error** — chances are someone solved it on Stack Overflow or GitHub Issues\n\nShare your error message or code snippet and I'll help you trace it down."
  }

  if (/git|github|commit|branch|merge|pull request|push|clone/.test(text)) {
    return "Git is the backbone of collaborative development. Here's a clean workflow:\n\n**Daily workflow:**\n```bash\ngit pull origin main          # sync latest\ngit checkout -b feature/name  # new branch\ngit add . && git commit -m \"feat: description\"  # stage & commit\ngit push origin feature/name  # push branch\n```\n\n**Undo mistakes:**\n- `git restore <file>` — discard unstaged changes\n- `git reset --soft HEAD~1` — undo last commit, keep changes staged\n- `git stash` — temporarily shelve changes\n\n**Pro tip:** Write commit messages in the imperative mood: \"Add auth middleware\" not \"Added auth middleware\".\n\nWhat Git challenge are you running into?"
  }

  if (/performance|slow|optimize|speed|lazy|memo|bundle|webpack|vite/.test(text)) {
    return "Performance optimization is an art. Here's a structured approach:\n\n**Frontend performance checklist:**\n\n- **Code splitting** — Use dynamic `import()` and `React.lazy()` to split your bundle\n- **Image optimization** — Use WebP format, proper sizing, and lazy loading (`loading=\"lazy\"`)\n- **Memoization** — `React.memo`, `useMemo`, `useCallback` to prevent expensive re-renders\n- **Bundle analysis** — Use `vite-bundle-visualizer` or webpack-bundle-analyzer to find bloat\n- **Network** — Enable HTTP/2, use a CDN, cache static assets aggressively\n- **Core Web Vitals** — Target LCP < 2.5s, FID < 100ms, CLS < 0.1\n\nWhat specific performance issue are you seeing? I can give targeted advice."
  }

  if (/explain|what is|how does|tell me about|describe|meaning of/.test(text)) {
    return "Great question! I'd be happy to explain that.\n\nTo give you the most accurate and useful answer, could you be a bit more specific about what you'd like me to explain? For example:\n\n- A specific programming concept (closures, promises, recursion)\n- A framework feature (React hooks, Next.js routing, Tailwind utilities)\n- A computer science topic (algorithms, data structures, design patterns)\n- Something about this chat app's code\n\nJust ask away — I'll break it down clearly with examples."
  }

  if (/thank|thanks|appreciate|great|awesome|perfect|good job/.test(text)) {
    return "You're very welcome! Happy to help.\n\nIf you run into anything else — a tricky bug, a concept you'd like explained, or a feature you want to build — just ask. That's what I'm here for. Good luck with your project!"
  }

  if (/who are you|what are you|your name|what can you do/.test(text)) {
    return "I'm your AI coding assistant, built into this chat interface.\n\nHere's what I can help you with:\n\n- **Code review & debugging** — Paste your code and I'll find the issue\n- **Concept explanations** — React, TypeScript, APIs, Git, and more\n- **Architecture advice** — How to structure your project, which tools to use\n- **Writing code** — Components, hooks, utility functions, and full features\n- **General conversation** — Sometimes you just need to think out loud\n\nWhat would you like to tackle?"
  }

  const fallbacks = [
    "That's an interesting point. Could you give me a bit more context so I can give you a precise, useful answer? For example, if it's a coding question, sharing the relevant code snippet or error message would help me help you much better.",
    "I want to make sure I give you the most accurate answer possible. Could you elaborate a bit more on what you're working on or what you're trying to achieve? The more context you share, the more tailored my response will be.",
    "Good question! To point you in the right direction, it would help to know: Is this a frontend, backend, or full-stack question? Are you using any specific frameworks or libraries? Share more details and I'll dive right in.",
    "I'm here and listening. That said, I'd love to understand the full picture — what's the goal you're trying to reach, and what have you tried so far? Let's work through it together."
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

// ─── Theme Configs ────────────────────────────────────────────────────────────
const themes = {
  girl: {
    bg: '#FFFDF8',
    headerBg: 'rgba(255,255,255,0.75)',
    headerBorder: '#F3E4EF',
    inputAreaBg: 'rgba(255,255,255,0.85)',
    inputBg: '#FBF4F8',
    inputBorder: '#F0DCEA',
    inputRing: '#E8B8D6',
    inputText: '#4A3B52',
    inputPlaceholder: '#C9A8C4',
    titleColor: '#5B3E63',
    titleFont: "'Baloo 2', sans-serif",
    bodyFont: "'Quicksand', sans-serif",
    userBubbleGrad: 'linear-gradient(135deg, #FF9FC4, #B9A2F0)',
    assistantBubbleBg: '#FFFFFF',
    assistantBubbleBorder: '#F3E4EF',
    assistantBubbleText: '#4A3B52',
    sendBtnGrad: 'linear-gradient(135deg, #FF9FC4, #B9A2F0)',
    onlineTagBg: '#E7F6EC',
    onlineTagText: '#3B7A55',
    onlineTagBorder: '#CDEBD8',
    cursorColor: '#FF9FC4',
    scrollbarThumb: '#F0DCEA',
    msgAreaBg: 'transparent',
    themeBtnBoyBg: '#EEF4FF',
    themeBtnBoyText: '#3B5998',
    themeBtnGirlBg: 'linear-gradient(135deg, #FF9FC4, #F5C6E0)',
    themeBtnGirlText: '#7B2D5E',
  },
  boy: {
    bg: '#0B1120',
    headerBg: 'rgba(11,17,32,0.92)',
    headerBorder: '#1E3050',
    inputAreaBg: 'rgba(11,17,32,0.95)',
    inputBg: '#111827',
    inputBorder: '#1E3050',
    inputRing: '#38BDF8',
    inputText: '#E2F0FF',
    inputPlaceholder: '#4B6080',
    titleColor: '#38BDF8',
    titleFont: "'Sora', sans-serif",
    bodyFont: "'Sora', sans-serif",
    userBubbleGrad: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    assistantBubbleBg: '#111827',
    assistantBubbleBorder: '#1E3050',
    assistantBubbleText: '#CBD5E1',
    sendBtnGrad: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    onlineTagBg: '#0C2A40',
    onlineTagText: '#38BDF8',
    onlineTagBorder: '#1E4D6B',
    cursorColor: '#38BDF8',
    scrollbarThumb: '#1E3050',
    msgAreaBg: 'transparent',
    themeBtnBoyBg: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
    themeBtnBoyText: '#FFFFFF',
    themeBtnGirlBg: '#1a2035',
    themeBtnGirlText: '#94A3B8',
  }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<Theme>('girl')
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm your AI assistant.\n\nI can help you with React, TypeScript, Tailwind CSS, debugging, Git, APIs, and much more. What would you like to work on today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const t = themes[theme]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600&family=Sora:wght@300;400;500;600&display=swap'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    const responseText = getSmartResponse(trimmed)

    for (let i = 0; i <= responseText.length; i++) {
      const delay = Math.random() * 20 + 8
      await new Promise(resolve => setTimeout(resolve, delay))
      setMessages(prev =>
        prev.map(msg => msg.id === assistantId ? { ...msg, content: responseText.slice(0, i) } : msg)
      )
    }

    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 128) + 'px'
  }

  return (
    <div
      className="flex flex-col h-screen relative overflow-hidden transition-colors duration-500"
      style={{ background: t.bg, fontFamily: t.bodyFont }}
    >
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes hexFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-14px) scale(1.04); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .bg-flower { animation: bob 6s ease-in-out infinite; }
        .bg-hex { animation: hexFloat 8s ease-in-out infinite; }
        .msg-appear { animation: fadeSlideIn 0.3s ease-out forwards; }
        .boy-grid-bg {
          background-image: linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: gridMove 20s linear infinite;
        }
        .boy-scanline {
          background: linear-gradient(transparent, rgba(56,189,248,0.03) 50%, transparent);
          height: 120px;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        textarea { resize: none; }
        textarea::placeholder { color: ${t.inputPlaceholder}; }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: ${t.scrollbarThumb}; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          .bg-flower, .bg-hex { animation: none; }
        }
        .theme-toggle-btn {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-toggle-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        code {
          background: ${theme === 'girl' ? '#FDF0F9' : '#0D1B2A'};
          color: ${theme === 'girl' ? '#B94D8B' : '#38BDF8'};
          border-radius: 4px;
          padding: 1px 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.88em;
        }
      `}</style>

      {/* ── Background Decorations ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {theme === 'girl' ? (
          <>
            {BG_FLOWERS.map((f, i) => (
              <div
                key={i}
                className="bg-flower absolute"
                style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s`, opacity: 0.55 }}
              >
                <Flower color={f.color} size={f.size} />
              </div>
            ))}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 20% 50%, rgba(255,159,196,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(185,162,240,0.07) 0%, transparent 60%)'
            }} />
          </>
        ) : (
          <>
            <div className="boy-grid-bg absolute inset-0" />
            <div className="boy-scanline absolute w-full top-0 left-0" />
            {BG_HEXES.map((h, i) => (
              <div
                key={i}
                className="bg-hex absolute"
                style={{ top: h.top, left: h.left, animationDelay: `${h.delay}s`, opacity: h.opacity }}
              >
                <HexIcon size={h.size} color="#38BDF8" />
              </div>
            ))}
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(ellipse at 10% 30%, rgba(14,165,233,0.07) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(99,102,241,0.08) 0%, transparent 50%)'
            }} />
          </>
        )}
      </div>

      {/* ── Header ── */}
      <header
        className="relative z-10 px-5 py-3.5 flex items-center justify-between backdrop-blur-md"
        style={{
          background: t.headerBg,
          borderBottom: `1px solid ${t.headerBorder}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          {theme === 'girl' ? (
            <Flower color="#FF9FC4" size={24} />
          ) : (
            <HexIcon size={24} color="#38BDF8" />
          )}
          <h1
            className="text-lg tracking-tight select-none"
            style={{ fontFamily: t.titleFont, fontWeight: 600, color: t.titleColor }}
          >
            {theme === 'girl' ? 'Bloom Chat' : 'NexusAI'}
          </h1>
        </div>

        {/* Right side: theme toggle + status */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <div
            className="flex items-center rounded-full p-0.5 gap-0.5"
            style={{ background: theme === 'girl' ? '#F5EEF8' : '#0D1B2A', border: `1px solid ${t.headerBorder}` }}
          >
            <button
              onClick={() => setTheme('girl')}
              className="theme-toggle-btn px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: theme === 'girl' ? themes.girl.themeBtnGirlBg : 'transparent',
                color: theme === 'girl' ? themes.girl.themeBtnGirlText : (theme === 'boy' ? '#4B6080' : '#888'),
                boxShadow: theme === 'girl' ? '0 2px 8px rgba(255,159,196,0.4)' : 'none',
              }}
            >
              Girl
            </button>
            <button
              onClick={() => setTheme('boy')}
              className="theme-toggle-btn px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: theme === 'boy' ? themes.boy.themeBtnBoyBg : 'transparent',
                color: theme === 'boy' ? themes.boy.themeBtnBoyText : (theme === 'girl' ? '#C9A8C4' : '#888'),
                boxShadow: theme === 'boy' ? '0 2px 8px rgba(14,165,233,0.35)' : 'none',
              }}
            >
              Boy
            </button>
          </div>

          {/* Online Badge */}
          <span
            className="text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5"
            style={{ background: t.onlineTagBg, color: t.onlineTagText, border: `1px solid ${t.onlineTagBorder}` }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: t.onlineTagText }}
            />
            Online
          </span>
        </div>
      </header>

      {/* ── Messages ── */}
      <div
        className="relative z-10 flex-1 overflow-y-auto custom-scroll px-4 md:px-6 py-6 space-y-5"
        style={{ background: t.msgAreaBg }}
      >
        <div className="max-w-3xl w-full mx-auto space-y-5">
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className={`msg-appear flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${idx === messages.length - 1 ? 0 : 0}ms` }}
            >
              {/* Assistant Avatar */}
              {m.role === 'assistant' && (
                <div className="mr-2.5 mt-1 flex-shrink-0">
                  {theme === 'girl' ? (
                    <Flower color="#B9A2F0" size={24} />
                  ) : (
                    <HexIcon size={24} color="#38BDF8" />
                  )}
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[72%] px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'text-white rounded-3xl rounded-br-md'
                    : 'rounded-3xl rounded-bl-md'
                }`}
                style={
                  m.role === 'user'
                    ? { background: t.userBubbleGrad }
                    : {
                        background: t.assistantBubbleBg,
                        border: `1px solid ${t.assistantBubbleBorder}`,
                        color: t.assistantBubbleText,
                        boxShadow: theme === 'boy' ? '0 0 0 1px rgba(56,189,248,0.05), 0 4px 20px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'
                      }
                }
              >
                <div className="whitespace-pre-wrap m-0 leading-relaxed">
                  {m.content}
                  {isLoading && m.id === messages[messages.length - 1].id && m.role === 'assistant' && (
                    <span
                      className="inline-block w-1.5 h-4 ml-0.5 align-middle rounded-full animate-pulse"
                      style={{ background: theme === 'girl' ? '#B9A2F0' : '#38BDF8' }}
                    />
                  )}
                </div>
              </div>

              {/* User Avatar placeholder for alignment */}
              {m.role === 'user' && <div className="ml-2.5 w-6 flex-shrink-0" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input Area ── */}
      <div
        className="relative z-10 px-4 py-3.5 backdrop-blur-md"
        style={{
          background: t.inputAreaBg,
          borderTop: `1px solid ${t.headerBorder}`,
        }}
      >
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full px-5 py-3 text-[14.5px] focus:outline-none transition-all duration-200 rounded-2xl"
              style={{
                background: t.inputBg,
                border: `1.5px solid ${t.inputBorder}`,
                color: t.inputText,
                fontFamily: t.bodyFont,
                maxHeight: '128px',
                boxShadow: `0 0 0 0px ${t.inputRing}`,
              }}
              onFocus={e => { e.target.style.borderColor = t.inputRing; e.target.style.boxShadow = `0 0 0 2.5px ${t.inputRing}33` }}
              onBlur={e => { e.target.style.borderColor = t.inputBorder; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95 disabled:opacity-35 flex items-center gap-2 flex-shrink-0"
            style={{
              background: t.sendBtnGrad,
              boxShadow: theme === 'boy' ? '0 4px 15px rgba(14,165,233,0.3)' : '0 4px 15px rgba(255,159,196,0.3)',
              fontFamily: t.bodyFont,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send
          </button>
        </div>

        <p
          className="text-center text-[10.5px] mt-2.5 opacity-40"
          style={{ color: t.inputText, fontFamily: t.bodyFont }}
        >
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
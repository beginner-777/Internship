import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const FLOWER_COLORS = ['#FF9FC4', '#B9A2F0', '#8FCBEA', '#FFD447', '#6FBE8F']

function Flower({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="20"
          cy="11"
          rx="7"
          ry="10"
          fill={color}
          opacity="0.85"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5.5" fill="#FFE9A8" />
    </svg>
  )
}

const BG_FLOWERS = [
  { top: '6%', left: '4%', size: 34, color: FLOWER_COLORS[0], delay: 0 },
  { top: '14%', left: '88%', size: 26, color: FLOWER_COLORS[2], delay: 1.2 },
  { top: '80%', left: '6%', size: 30, color: FLOWER_COLORS[3], delay: 0.6 },
  { top: '90%', left: '82%', size: 24, color: FLOWER_COLORS[1], delay: 1.8 },
  { top: '40%', left: '92%', size: 20, color: FLOWER_COLORS[4], delay: 0.9 },
  { top: '55%', left: '2%', size: 22, color: FLOWER_COLORS[2], delay: 0.3 },
  { top: '2%', left: '45%', size: 20, color: FLOWER_COLORS[3], delay: 1.5 },
  { top: '95%', left: '45%', size: 18, color: FLOWER_COLORS[0], delay: 0.4 },
]

// Expanded smart responses to handle more phrases, emotions, and questions
function getSmartResponse(input: string): string {
  const text = input.toLowerCase();

  if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
    return "Hello! How can I help you with your frontend or software engineering project today?";
  } 
  else if (text.includes('kais') || text.includes('how are you') || text.includes('how r u')) {
    return "I'm doing wonderful, thank you for asking! Ready to help you build awesome features.";
  } 
  else if (text.includes('tired') || text.includes('exhausted') || text.includes('sleepy')) {
    return "Aww, coding and assignments can be so draining! Make sure you take a nice little break and drink some water. You've got this!";
  }
  else if (text.includes('friend') || text.includes('bestie')) {
    return "Of course! I'm your digital buddy right here in your chat app, always ready to cheer you on!";
  }
  else if (text.includes('code') || text.includes('react') || text.includes('tailwind') || text.includes('assignment')) {
    return "This streaming chat application is successfully built with React and Tailwind CSS. Let me know if you need help modifying components or adding logic!";
  } 
  else if (text.includes('thank')) {
    return "You're very welcome! Let me know if you need anything else.";
  } 
  else {
    // Array of friendly varied fallbacks so it never repeats the exact same line
    const fallbacks = [
      "That is super interesting! Tell me a bit more about what you're working on.",
      "I love hearing your thoughts! How is your day going otherwise?",
      "Hmm, I see! Do you want to test out some more features on this chat interface?",
      "That's a neat point! Let's keep exploring and building together."
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi there! I'm your cute little assistant. What are we working on today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap'
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
      const delay = Math.random() * (35 - 15) + 15;
      await new Promise(resolve => setTimeout(resolve, delay))
      setMessages(prev => prev.map(msg => msg.id === assistantId ? { ...msg, content: responseText.slice(0, i) } : msg))
    }

    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className="flex flex-col h-screen relative overflow-hidden"
      style={{ background: '#FFFDF8', fontFamily: "'Quicksand', sans-serif" }}
    >
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        .bg-flower { animation: bob 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .bg-flower { animation: none; }
        }
        textarea::placeholder { color: #B9A9C4; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {BG_FLOWERS.map((f, i) => (
          <div
            key={i}
            className="bg-flower absolute"
            style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
          >
            <Flower color={f.color} size={f.size} />
          </div>
        ))}
      </div>

      <header className="relative z-10 border-b border-[#F3E4EF] px-5 py-4 bg-white/70 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Flower color="#FF9FC4" size={26} />
          <h1
            className="text-xl text-[#5B3E63] tracking-tight"
            style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600 }}
          >
            Bloom Chat
          </h1>
        </div>
        <span className="text-xs bg-[#E7F6EC] text-[#3B7A55] border border-[#CDEBD8] px-3 py-1 rounded-full font-medium">
          Online
        </span>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5 max-w-3xl w-full mx-auto">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="mr-2 mt-1 flex-shrink-0">
                <Flower color="#B9A2F0" size={26} />
              </div>
            )}
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'text-white rounded-br-lg'
                  : 'bg-white border border-[#F3E4EF] text-[#4A3B52] rounded-bl-lg'
              }`}
              style={m.role === 'user' ? { background: 'linear-gradient(135deg, #FF9FC4, #B9A2F0)' } : undefined}
            >
              <p className="whitespace-pre-wrap m-0">
                {m.content}
                {isLoading && m.id === messages[messages.length - 1].id && m.role === 'assistant' && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-[#B9A2F0] rounded-full animate-pulse" />
                )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-10 border-t border-[#F3E4EF] bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 resize-none bg-[#FBF4F8] border border-[#F0DCEA] rounded-3xl px-5 py-3 text-[15px] text-[#4A3B52] focus:outline-none focus:ring-2 focus:ring-[#E8B8D6] max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="text-white px-6 py-3 rounded-full text-sm font-semibold transition-transform active:scale-95 disabled:opacity-40 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #FF9FC4, #B9A2F0)' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Bot, RotateCcw, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assistantPrompts } from '../data/portfolioData';
import { getAssistantResponse } from '../utils/assistantEngine';

const welcome = {
  role: 'assistant',
  text: 'Portfolio intelligence is online. Ask me about Musfirah’s verified experience, project, skills or education.',
};

export default function AIAssistant() {
  const { assistantOpen, setAssistantOpen } = useApp();
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const submit = (value) => {
    const clean = value.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: getAssistantResponse(clean) },
    ]);
    setInput('');
  };

  return (
    <AnimatePresence>
      {assistantOpen && (
        <motion.aside
          id="portfolio-assistant"
          className="assistant-panel"
          initial={{ opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 28, scale: 0.97 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          aria-label="Portfolio AI assistant"
        >
          <header className="assistant-header">
            <div className="assistant-avatar"><Bot size={20} /></div>
            <div>
              <span className="eyebrow">STRUCTURED DATA AGENT</span>
              <h2>Musfirah AI</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setAssistantOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message ${message.role}`}
              >
                {message.role === 'assistant' && <Sparkles size={13} />}
                <p>{message.text}</p>
              </motion.div>
            ))}
          </div>

          {messages.length === 1 && (
            <div className="prompt-grid">
              {assistantPrompts.slice(0, 4).map((prompt) => (
                <button key={prompt} type="button" onClick={() => submit(prompt)}>{prompt}</button>
              ))}
            </div>
          )}

          <form
            className="assistant-input"
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
          >
            <label className="sr-only" htmlFor="assistant-question">Ask a question</label>
            <input
              ref={inputRef}
              id="assistant-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about the developer…"
              autoComplete="off"
            />
            <button type="submit" aria-label="Send question"><ArrowUp size={17} /></button>
          </form>

          <button className="assistant-reset" type="button" onClick={() => setMessages([welcome])}>
            <RotateCcw size={12} /> Reset memory
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

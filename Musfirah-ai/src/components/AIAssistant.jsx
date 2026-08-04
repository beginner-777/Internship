import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Bot, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { assistantPrompts } from '../data/portfolioData';
import { requestAssistantResponse } from '../services/assistantService';
import { getAssistantResponse } from '../utils/assistantEngine';

const welcome = {
  role: 'assistant',
  text: 'Portfolio intelligence is online. Ask me about Musfirah’s verified experience, project, skills or education.',
};

export default function AIAssistant() {
  const { assistantOpen, setAssistantOpen } = useApp();
  const [messages, setMessages] = useState([welcome]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [connectionMode, setConnectionMode] = useState('secure');
  const inputRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    if (!assistantOpen) return undefined;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(focusTimer);
  }, [assistantOpen]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const submit = async (value) => {
    const clean = value.trim();
    if (!clean || pending) return;

    const userMessage = { role: 'user', text: clean };
    const apiMessages = [...messages.slice(1), userMessage]
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.text }));

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setPending(true);

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const result = await requestAssistantResponse(apiMessages, controller.signal);
      setMessages((current) => [...current, { role: 'assistant', text: result.answer }]);
      setConnectionMode('live');
    } catch (error) {
      if (error.name === 'AbortError') return;
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: getAssistantResponse(clean) },
      ]);
      setConnectionMode('fallback');
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
      setPending(false);
    }
  };

  const clearConversation = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setMessages([welcome]);
    setInput('');
    setPending(false);
    setConnectionMode('secure');
    window.setTimeout(() => inputRef.current?.focus(), 0);
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
              <span className="eyebrow">GEMINI INTERACTIONS AGENT</span>
              <h2>Musfirah AI</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setAssistantOpen(false)} aria-label="Close assistant">
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" aria-live="polite" aria-busy={pending}>
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
            {pending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="message assistant thinking"
                aria-label="Musfirah AI is generating a verified response"
              >
                <LoaderCircle className="spin" size={14} />
                <p>Checking verified portfolio data…</p>
              </motion.div>
            )}
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
              disabled={pending}
            />
            <button type="submit" aria-label="Send question" disabled={pending}><ArrowUp size={17} /></button>
          </form>

          <div className="assistant-footer">
            <button className="assistant-reset" type="button" onClick={clearConversation}>
              <RotateCcw size={12} /> Clear conversation
            </button>
            <span className={`assistant-mode ${connectionMode}`}>
              <i /> {connectionMode === 'live' ? 'GEMINI LIVE' : connectionMode === 'fallback' ? 'VERIFIED FALLBACK' : 'SECURE API'}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

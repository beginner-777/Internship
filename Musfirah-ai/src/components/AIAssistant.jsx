import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Bot, LoaderCircle, RotateCcw, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  MAX_ASSISTANT_HISTORY_MESSAGES,
  MAX_ASSISTANT_INPUT_LENGTH,
} from '../constants/assistant';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!assistantOpen) return undefined;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(focusTimer);
  }, [assistantOpen]);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, pending]);

  const submit = async (value) => {
    const clean = value.trim();
    if (!clean || pending) return;

    if (clean.length > MAX_ASSISTANT_INPUT_LENGTH) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: `Questions are limited to ${MAX_ASSISTANT_INPUT_LENGTH} characters.`,
          error: true,
        },
      ]);
      return;
    }

    const userMessage = { role: 'user', text: clean };
    const apiMessages = [
      ...messages.slice(1).filter((message) => !message.error),
      userMessage,
    ]
      .slice(-MAX_ASSISTANT_HISTORY_MESSAGES)
      .map((message) => ({ role: message.role, content: message.text }));

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setPending(true);

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const result = await requestAssistantResponse(apiMessages, controller.signal);
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: result.answer, source: 'gemini' },
      ]);
      setConnectionMode('live');
    } catch (error) {
      if (error.name === 'AbortError') return;

      if (error.code === 'RATE_LIMITED') {
        const wait = error.retryAfter > 0 ? ` Try again in about ${error.retryAfter} seconds.` : '';
        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            text: `Rate limit exceeded. Please wait before trying again.${wait}`,
            error: true,
          },
        ]);
        setConnectionMode('limited');
      } else if (error.code === 'VALIDATION_ERROR') {
        setMessages((current) => [
          ...current,
          { role: 'assistant', text: error.message, error: true },
        ]);
        setConnectionMode('secure');
      } else {
        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            text: `Live Gemini is temporarily unavailable. ${getAssistantResponse(clean)}`,
            source: 'fallback',
          },
        ]);
        setConnectionMode('fallback');
      }
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
                className={`message ${message.role} ${message.error ? 'error' : ''}`}
                role={message.error ? 'alert' : undefined}
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
            <span ref={messagesEndRef} aria-hidden="true" />
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
              maxLength={MAX_ASSISTANT_INPUT_LENGTH}
              aria-describedby="assistant-input-limit"
            />
            <button type="submit" aria-label="Send question" disabled={pending || !input.trim()}><ArrowUp size={17} /></button>
          </form>

          <div id="assistant-input-limit" className="assistant-input-meta" aria-live="polite">
            <span>Maximum {MAX_ASSISTANT_INPUT_LENGTH} characters</span>
            <strong>{input.length}/{MAX_ASSISTANT_INPUT_LENGTH}</strong>
          </div>

          <div className="assistant-footer">
            <button className="assistant-reset" type="button" onClick={clearConversation}>
              <RotateCcw size={12} /> Clear conversation
            </button>
            <span className={`assistant-mode ${connectionMode}`}>
              <i /> {connectionMode === 'live'
                ? 'GEMINI LIVE'
                : connectionMode === 'fallback'
                  ? 'VERIFIED FALLBACK'
                  : connectionMode === 'limited'
                    ? 'LIMIT REACHED'
                    : 'SECURE API'}
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

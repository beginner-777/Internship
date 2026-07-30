import React, { useState } from "react";

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    min-height: 100%;
  }

  body {
    background: #e5e7eb;
    color: #1f2937;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif;
  }

  button, input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .app-background {
    min-height: 100vh;
    padding: 24px;
    background:
      radial-gradient(circle at top left, #f8fafc 0, transparent 35%),
      linear-gradient(135deg, #d1d5db, #eef0f2);
  }

  .dashboard {
    width: 100%;
    max-width: 1120px;
    height: calc(100vh - 48px);
    min-height: 650px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f7f7f8;
    border: 1px solid #d1d5db;
    border-radius: 18px;
    box-shadow: 0 24px 60px rgba(17, 24, 39, 0.14);
  }

  .header {
    min-height: 78px;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .brand-icon {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    color: white;
    font-size: 18px;
    font-weight: 700;
    background: #30343b;
    border-radius: 11px;
  }

  .header h1 {
    margin: 0;
    color: #17191d;
    font-size: 18px;
    font-weight: 680;
    letter-spacing: -0.3px;
  }

  .header p {
    margin: 5px 0 0;
    color: #7b818b;
    font-size: 12px;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    color: #3f4650;
    font-size: 12px;
    font-weight: 600;
    background: #f4f5f6;
    border: 1px solid #e0e2e5;
    border-radius: 999px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    background: #22a06b;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(34, 160, 107, 0.13);
  }

  .content {
    flex: 1;
    padding: 28px;
    overflow-y: auto;
    background: #f5f6f7;
  }

  .empty-state {
    max-width: 610px;
    margin: 75px auto 0;
    padding: 46px 40px;
    text-align: center;
    background: #ffffff;
    border: 1px solid #e0e2e5;
    border-radius: 18px;
    box-shadow: 0 12px 35px rgba(31, 41, 55, 0.07);
  }

  .empty-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 21px;
    display: grid;
    place-items: center;
    color: #ffffff;
    font-size: 23px;
    background: #34383f;
    border-radius: 15px;
    box-shadow: 0 8px 18px rgba(31, 41, 55, 0.2);
  }

  .empty-state h2 {
    margin: 0 0 10px;
    color: #202329;
    font-size: 22px;
    font-weight: 680;
    letter-spacing: -0.4px;
  }

  .empty-state p {
    max-width: 485px;
    margin: 0 auto;
    color: #717780;
    font-size: 14px;
    line-height: 1.65;
  }

  .example {
    margin-top: 23px;
    padding: 13px 16px;
    color: #5d626b;
    font-size: 12px;
    line-height: 1.5;
    background: #f5f6f7;
    border: 1px solid #e1e3e6;
    border-radius: 10px;
  }

  .message-row {
    display: flex;
    margin-bottom: 18px;
  }

  .message-row.user {
    justify-content: flex-end;
  }

  .message-group {
    max-width: 75%;
  }

  .message {
    padding: 13px 16px;
    font-size: 14px;
    line-height: 1.55;
    border-radius: 14px;
  }

  .message.user {
    color: #ffffff;
    background: #34383f;
    border-bottom-right-radius: 4px;
    box-shadow: 0 5px 13px rgba(31, 41, 55, 0.15);
  }

  .message.assistant {
    color: #34383f;
    background: #ffffff;
    border: 1px solid #dde0e4;
    border-bottom-left-radius: 4px;
  }

  .message-label {
    display: block;
    margin-bottom: 4px;
    color: inherit;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    opacity: 0.65;
  }

  .score-link {
    margin-top: 8px;
    padding: 8px 12px;
    color: #454a52;
    font-size: 12px;
    font-weight: 650;
    background: #ffffff;
    border: 1px solid #d8dadd;
    border-radius: 9px;
    transition: 0.2s ease;
  }

  .score-link:hover {
    color: #ffffff;
    background: #34383f;
    border-color: #34383f;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 11px;
    width: fit-content;
    padding: 12px 15px;
    color: #626871;
    font-size: 13px;
    background: #ffffff;
    border: 1px solid #dfe2e5;
    border-radius: 12px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-top-color: #34383f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .input-area {
    padding: 18px 24px;
    background: #ffffff;
    border-top: 1px solid #e0e2e5;
  }

  .input-wrapper {
    display: flex;
    gap: 10px;
    max-width: 920px;
    margin: 0 auto;
  }

  .input-wrapper input {
    flex: 1;
    min-width: 0;
    padding: 13px 16px;
    color: #25282d;
    font-size: 14px;
    background: #f7f7f8;
    border: 1px solid #d5d8dc;
    border-radius: 11px;
    outline: none;
    transition: 0.2s ease;
  }

  .input-wrapper input:focus {
    background: #ffffff;
    border-color: #6b7280;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.12);
  }

  .submit-button {
    padding: 0 22px;
    color: white;
    font-size: 13px;
    font-weight: 650;
    background: #30343b;
    border: none;
    border-radius: 11px;
    transition: 0.2s ease;
  }

  .submit-button:hover:not(:disabled) {
    background: #191c20;
    transform: translateY(-1px);
  }

  .submit-button:disabled {
    cursor: not-allowed;
    background: #9ca3af;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    padding: 20px;
    display: grid;
    place-items: center;
    background: rgba(22, 25, 29, 0.55);
    backdrop-filter: blur(5px);
    animation: fadeIn 0.2s ease;
  }

  .modal {
    width: 100%;
    max-width: 570px;
    overflow: hidden;
    background: #f0f1f2;
    border: 1px solid #aeb2b7;
    border-radius: 17px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
    animation: modalIn 0.22s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    padding: 19px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    background: linear-gradient(135deg, #24272c, #444950);
  }

  .modal-heading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .modal-heading-icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  .modal-eyebrow {
    margin-bottom: 3px;
    color: #bfc3c8;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 650;
  }

  .close-icon {
    width: 33px;
    height: 33px;
    color: #d6d8db;
    font-size: 17px;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 50%;
  }

  .close-icon:hover {
    color: white;
    background: rgba(255, 255, 255, 0.16);
  }

  .modal-body {
    padding: 22px;
  }

  .score-summary {
    padding: 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 1px solid #d4d7da;
    border-radius: 13px;
  }

  .field-label {
    display: block;
    margin-bottom: 6px;
    color: #777d85;
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .rating {
    color: #2d3137;
    font-size: 18px;
    font-weight: 720;
  }

  .score {
    color: #25282d;
    font-size: 34px;
    font-weight: 760;
    letter-spacing: -1px;
  }

  .score small {
    color: #8a9098;
    font-size: 13px;
    font-weight: 500;
  }

  .detail-grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .detail-card {
    min-height: 82px;
    padding: 15px;
    background: #e3e5e7;
    border: 1px solid #cbd0d4;
    border-radius: 11px;
  }

  .detail-value {
    color: #31353b;
    font-size: 13px;
    font-weight: 650;
    line-height: 1.45;
  }

  .recommendation {
    margin-top: 12px;
    padding: 17px;
    color: #e9eaec;
    background: #383c43;
    border-radius: 11px;
  }

  .recommendation .field-label {
    color: #aeb3ba;
  }

  .recommendation p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
  }

  .timestamp {
    margin-top: 14px;
    color: #858b93;
    font-size: 10px;
    text-align: right;
  }

  .modal-footer {
    padding: 14px 22px;
    display: flex;
    justify-content: flex-end;
    background: #e2e4e6;
    border-top: 1px solid #c8ccd0;
  }

  .close-button {
    padding: 10px 21px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 650;
    background: #30343b;
    border: none;
    border-radius: 9px;
  }

  .close-button:hover {
    background: #1d2024;
  }

  @media (max-width: 640px) {
    .app-background {
      padding: 0;
    }

    .dashboard {
      height: 100vh;
      min-height: 100vh;
      border: none;
      border-radius: 0;
    }

    .header {
      padding: 14px 16px;
    }

    .header h1 {
      font-size: 15px;
    }

    .status {
      display: none;
    }

    .content {
      padding: 18px 14px;
    }

    .empty-state {
      margin-top: 38px;
      padding: 32px 20px;
    }

    .message-group {
      max-width: 88%;
    }

    .input-area {
      padding: 12px;
    }

    .input-wrapper {
      align-items: stretch;
    }

    .submit-button {
      padding: 0 15px;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim() || isLoading) return;

    const query = input.trim();

    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-user`,
        role: "user",
        content: query,
      },
    ]);

    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const result = {
        companyName: "Nexus Corp",
        score: 85,
        rating: "Hot Lead",
        industry: "SaaS & Cloud Solutions",
        budget: "$65,000",
        teamSize: "30 Employees",
        recommendation:
          "Prioritize this lead for immediate outreach by a senior account executive.",
        analyzedAt: new Date().toISOString(),
      };

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: `Lead analysis completed for "${query}".`,
        toolInvocations: [
          {
            toolCallId: `call-${Date.now()}`,
            result,
          },
        ],
      };

      setMessages((previous) => [...previous, assistantMessage]);
      setIsLoading(false);

      // Automatically show popup after analysis.
      setActivePopup(result);
    }, 1000);
  };

  const closePopup = () => setActivePopup(null);

  return (
    <>
      <style>{styles}</style>

      <div className="app-background">
        <div className="dashboard">
          <header className="header">
            <div className="brand">
              <div className="brand-icon">LS</div>

              <div>
                <h1>Lead Intelligence Dashboard</h1>
                <p>AI-powered lead qualification and scoring</p>
              </div>
            </div>

            <div className="status">
              <span className="status-dot" />
              System active
            </div>
          </header>

          <main className="content">
            {messages.length === 0 && (
              <section className="empty-state">
                <div className="empty-icon">↗</div>

                <h2>Analyze your next opportunity</h2>

                <p>
                  Enter the company details below to generate a structured lead
                  score, qualification summary and recommended next action.
                </p>

                <div className="example">
                  Try: “Score Nexus Corp, a SaaS company with a $65,000 budget
                  and 30 employees.”
                </div>
              </section>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${
                  message.role === "user" ? "user" : ""
                }`}
              >
                <div className="message-group">
                  <div className={`message ${message.role}`}>
                    <span className="message-label">
                      {message.role === "user" ? "YOU" : "AI ANALYST"}
                    </span>

                    {message.content}
                  </div>

                  {message.toolInvocations?.map((tool) => (
                    <button
                      type="button"
                      className="score-link"
                      key={tool.toolCallId}
                      onClick={() => setActivePopup(tool.result)}
                    >
                      View lead score report →
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="loading">
                <span className="spinner" />
                Evaluating lead information...
              </div>
            )}
          </main>

          <form className="input-area" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Enter company and lead information..."
                disabled={isLoading}
              />

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "Analyzing..." : "Analyze Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {activePopup && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePopup();
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
          >
            <header className="modal-header">
              <div className="modal-heading">
                <div className="modal-heading-icon">↗</div>

                <div>
                  <div className="modal-eyebrow">
                    Lead qualification report
                  </div>

                  <h3 id="report-title">{activePopup.companyName}</h3>
                </div>
              </div>

              <button
                type="button"
                className="close-icon"
                onClick={closePopup}
                aria-label="Close popup"
              >
                ×
              </button>
            </header>

            <div className="modal-body">
              <div className="score-summary">
                <div>
                  <span className="field-label">Lead classification</span>
                  <div className="rating">{activePopup.rating}</div>
                </div>

                <div>
                  <span className="field-label">Overall score</span>
                  <div className="score">
                    {activePopup.score}
                    <small>/100</small>
                  </div>
                </div>
              </div>

              <div className="detail-grid">
                <DetailCard
                  label="Industry"
                  value={activePopup.industry}
                />

                <DetailCard
                  label="Estimated budget"
                  value={activePopup.budget}
                />

                <DetailCard
                  label="Company size"
                  value={activePopup.teamSize}
                />

                <DetailCard
                  label="Current priority"
                  value={activePopup.rating}
                />
              </div>

              <div className="recommendation">
                <span className="field-label">Recommended action</span>
                <p>{activePopup.recommendation}</p>
              </div>

              <div className="timestamp">
                Analysis completed{" "}
                {new Date(activePopup.analyzedAt).toLocaleString()}
              </div>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className="close-button"
                onClick={closePopup}
              >
                Close report
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="detail-card">
      <span className="field-label">{label}</span>
      <div className="detail-value">{value}</div>
    </div>
  );
}
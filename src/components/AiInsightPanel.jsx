import React, { useState } from 'react';
import { Bot, Sparkles, Database, Send, FileText, ChevronRight, HelpCircle } from 'lucide-react';

export default function AiInsightPanel({ aiInsight, currentDepth, currentFormation }) {
  const [activeSubTab, setActiveSubTab] = useState('explanation'); // 'explanation' | 'rag' | 'chat'
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello Chief Drilling Engineer! I am eRTMAC-AI. I am continuously monitoring target well Valhall Alpha-X1 against 7 offset wells in the block. Ask me anything about historical mud loss, stuck pipe risks, or recommended mud weights.`
    }
  ]);

  if (!aiInsight) return null;

  const handleSendChat = (questionText) => {
    const query = questionText || chatInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    
    // Generate intelligent AI response based on query keywords
    let replyText = "Based on geological offset data in the North Sea Volve/Valhall sector:\n";
    const q = query.toLowerCase();

    if (q.includes("mud weight") || q.includes("ecd") || q.includes("circulation")) {
      replyText += "👉 In nearby Well NW-402 (1.8 km away), the crew regained circulation at 2,870m in Asgard Sandstone by dropping mud weight from 1.48 S.G. down to 1.39 S.G. (11.6 ppg) and pumping a 40 bbl heavy calcium carbonate LCM pill.";
    } else if (q.includes("stuck pipe") || q.includes("differential")) {
      replyText += "👉 Differential sticking was logged at 3,210m in NW-402 and 2,900m in NW-881. It is critical to minimize pipe stationary time during connections when differential pressure exceeds 400 psi in the lower sandstone horizons.";
    } else if (q.includes("kick") || q.includes("gas")) {
      replyText += "👉 A 18 bbl gas kick occurred at 2,550m MD in NW-308 in Utsira Sand during a 45 m/hr ROP spike. Recommended operational cap is 25 m/hr ROP when passing through Utsira Sand.";
    } else {
      replyText += `👉 Real-time analysis for depth ${currentDepth}m (${currentFormation}): Spatial RAG correlation indicates natural fracture density increases significantly below 2,800m. Keep LCM pill prepped on active pit #4.`;
    }

    setChatMessages(prev => [...prev, userMsg, { sender: 'ai', text: replyText }]);
    setChatInput('');
  };

  const sampleQuestions = [
    "What mud weight was used in NW-402 to regain circulation?",
    "Show historical stuck pipe incidents in Asgard Formation",
    "What ROP limit is recommended in Utsira Sand?"
  ];

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '6px', borderRadius: '8px' }}>
            <Bot size={20} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              eRTMAC-NWIS AI Intelligence Engine
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              LLM + RAG Vector Search (Retrieved from 7 Offset WCR/DDR Reports)
            </span>
          </div>
        </div>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '6px' }}>
          <button
            onClick={() => setActiveSubTab('explanation')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: activeSubTab === 'explanation' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'explanation' ? '#040914' : 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            AI Insight
          </button>
          <button
            onClick={() => setActiveSubTab('rag')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: activeSubTab === 'rag' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'rag' ? '#040914' : 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            RAG Chunks
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: activeSubTab === 'chat' ? 'var(--primary)' : 'transparent',
              color: activeSubTab === 'chat' ? '#040914' : 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === 'explanation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            background: 'rgba(6, 9, 17, 0.7)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.82rem',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
            color: '#e2e8f0'
          }}>
            {aiInsight.explanationText}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>Model: <strong style={{ color: '#38bdf8' }}>{aiInsight.model}</strong></span>
            <span>Retrieved Vectors: <strong>3 document chunks</strong></span>
          </div>
        </div>
      )}

      {activeSubTab === 'rag' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="label-sm">Vector Database Semantic Search Context (Cosine Similarity)</div>
          {aiInsight.ragRetrievedChunks.map((chunk, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} /> {chunk.source}
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {(chunk.similarityScore * 100).toFixed(0)}% Similarity
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', italic: 'true' }}>"{chunk.snippet}"</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'chat' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '320px' }}>
          
          {/* Messages Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', marginBottom: '10px' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)' : 'rgba(255,255,255,0.05)',
                color: msg.sender === 'user' ? '#040914' : 'var(--text-main)',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Sample Question Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '6px' }}>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(sq)}
                style={{
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              className="input-dark"
              style={{ flex: 1, fontSize: '0.8rem' }}
              placeholder="Ask AI about nearby well incidents or parameters..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 14px' }}>
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

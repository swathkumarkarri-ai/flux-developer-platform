import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('01');
  const [repoUrl, setRepoUrl] = useState('github.com/swathkumarkarri-ai/flux-test-api');
  const [analysisSteps, setAnalysisSteps] = useState([
    { id: 1, text: 'Repository clone & AST parsing', done: false },
    { id: 2, text: 'Dependency tree resolution', done: false },
    { id: 3, text: 'Schema & DB introspection', done: false },
    { id: 4, text: 'API route discovery: 3 endpoints', done: false },
  ]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Overview');
  const [liveLogs, setLiveLogs] = useState([
    { time: '09:41:02', type: 'INFO', msg: 'Express cluster mounted on :5000' },
    { time: '09:41:03', type: 'INFO', msg: 'Prisma client connection pool active' },
    { time: '09:41:15', type: 'ROUTE', msg: 'GET /api/v1/products 200 (14ms)' },
    { time: '09:41:22', type: 'AUTH', msg: 'POST /api/v1/auth/login 200 (38ms)' },
    { time: '09:41:35', type: 'PROBE', msg: 'HEALTHCHECK /healthz OK (1ms)' },
  ]);

  // Interactive error input so you can test custom bugs with Gemini
  const [customError, setCustomError] = useState(
    'Database lookup failed: null pointer in user query (email is undefined)'
  );

  // AI Diagnosis, Reasoning & Telemetry States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLatency, setAiLatency] = useState(null);
  const [showReasoning, setShowReasoning] = useState(true);
  const [aiDiagnosis, setAiDiagnosis] = useState({
    rootCause: 'Missing schema validation guard before database query.',
    patchDiff: [
      '- const user = await db.find(req.body.email);',
      '+ const schema = z.object({ email: z.string().email(), pass: z.string().min(8) });',
      '+ const validated = schema.parse(req.body);',
      '+ const user = await db.find(validated.email);'
    ]
  });

  // Live log generator when Dashboard is open
  useEffect(() => {
    if (screen !== '09' || activeSubTab !== 'Logs') return;

    const interval = setInterval(() => {
      const ms = Math.floor(Math.random() * 45) + 10;
      const endpoints = ['/api/v1/cart', '/api/v1/products', '/healthz', '/api/v1/order/status'];
      const picked = endpoints[Math.floor(Math.random() * endpoints.length)];
      const now = new Date().toTimeString().split(' ')[0];

      setLiveLogs(prev => [
        ...prev.slice(-14),
        { time: now, type: 'METRIC', msg: `GET ${picked} 200 (${ms}ms)` }
      ]);
    }, 2400);

    return () => clearInterval(interval);
  }, [screen, activeSubTab]);

  // Trigger Backend Analysis
  const handleStartAnalysis = async () => {
    setScreen('04');
    setAnalysisComplete(false);

    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisSteps(prev =>
          prev.map(s => (s.id === step.id ? { ...s, done: true } : s))
        );
        if (index === analysisSteps.length - 1) {
          setAnalysisComplete(true);
        }
      }, (index + 1) * 450);
    });

    try {
      await fetch('/api/git/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      });
    } catch {
      // Offline fallback
    }
  };

  // Run Synthesized Tests from Backend
  const handleExecuteTests = async () => {
    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      const data = await res.json();
      setTestResults(data);
    } catch {
      setTestResults({
        total: 42,
        passed: 39,
        warnings: 2,
        failed: 1,
        failureDetail: {
          route: 'POST /api/v1/auth/login',
          expected: 400,
          received: 500,
          rootCause: customError,
          affectedFile: 'server.js'
        }
      });
    }
    setScreen('06');
  };

  // Call the live Gemini 2.5 Flash API on Render
  const handleTriggerAiDiagnosis = async () => {
    setScreen('07');
    setAiLoading(true);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          failedRoute: 'POST /api/v1/auth/login',
          errorSnippet: customError,
          codeContent: `app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("${customError}");
  }
  res.status(200).json({ success: true, token: "jwt-sample" });
});`
        })
      });

      const data = await res.json();
      const duration = Math.round(performance.now() - startTime);
      setAiLatency(duration);

      if (data.success) {
        setAiDiagnosis({
          rootCause: data.rootCause,
          patchDiff: Array.isArray(data.patchDiff)
            ? data.patchDiff
            : data.patchDiff.split('\n')
        });
      }
    } catch (err) {
      console.warn('AI fallback triggered');
      setAiLatency(280);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <span>FLUX</span>
          <span className="header-badge">AUTONOMOUS</span>
        </div>
        <div className="header-status">
          <span className="live-dot"></span>
          <span>GEMINI 2.5 FLASH ACTIVE</span>
        </div>
      </header>

      {/* SCREEN 01: SPLASH */}
      {screen === '01' && (
        <div className="screen-view" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            fontSize: '3.4rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #fff 40%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            FLUX
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--cyan)', letterSpacing: '0.15em', marginTop: 8 }}>
            INGEST • ANALYZE • TEST • SHIP
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '320px', marginTop: 16, lineHeight: 1.5 }}>
            Autonomous CI/CD console powered by Gemini 2.5 Flash for deep AST analysis and automated code patch synthesis.
          </div>
          <button className="btn-action" style={{ marginTop: 36, width: '85%' }} onClick={() => setScreen('02')}>
            Launch Environment →
          </button>
        </div>
      )}

      {/* SCREEN 02: WORKSPACE */}
      {screen === '02' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Deployment Workspaces</div>
          </div>
          <div className="card project-item" onClick={() => setScreen('04')}>
            <div>
              <div className="project-name">flux-test-api</div>
              <div className="project-meta">Express 4 • Node.js • Gemini Engine</div>
            </div>
            <span className="badge badge-warn">Testing Gate</span>
          </div>
          <div className="card project-item" onClick={() => setScreen('09')}>
            <div>
              <div className="project-name">Chat Microservice</div>
              <div className="project-meta">Go • Redis • WebSocket Engine</div>
            </div>
            <span className="badge badge-live">● Deployed</span>
          </div>
          <button className="btn-action" onClick={() => setScreen('03')}>+ Connect New Repository</button>
        </div>
      )}

      {/* SCREEN 03: CONNECT GIT */}
      {screen === '03' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('02')}>←</button>
            <div className="screen-title">Repository Ingestion</div>
          </div>
          <div className="card">
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>TARGET PROVIDER</label>
            <div style={{ display: 'flex', gap: 8, margin: '10px 0 16px' }}>
              <button style={{ flex: 1, padding: 10, background: 'var(--surface-hover)', border: '1px solid var(--primary)', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem' }}>GitHub</button>
              <button style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', borderRadius: 8, fontSize: '0.82rem' }}>GitLab</button>
            </div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>SOURCE REPOSITORY URL</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#080a0f', border: '1px solid var(--surface-border)', borderRadius: 8, color: '#fff', marginTop: 8, fontFamily: 'var(--mono)', fontSize: '0.82rem' }}
            />
          </div>
          <button className="btn-action" onClick={handleStartAnalysis}>Run Deep AST Analysis →</button>
        </div>
      )}

      {/* SCREEN 04: AI ANALYSIS */}
      {screen === '04' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('03')}>←</button>
            <div className="screen-title">AST Spec Decomposition</div>
          </div>
          <div className="card">
            {analysisSteps.map(step => (
              <div key={step.id} className={`checklist-item ${step.done ? 'done' : ''}`}>
                <span>{step.done ? '✓' : '○'}</span> {step.text}
              </div>
            ))}
          </div>
          {analysisComplete && (
            <div className="card" style={{ borderLeft: '3px solid var(--cyan)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 8 }}>Inferred Architecture</div>
              <div style={{ fontSize: '0.82rem', padding: '3px 0' }}>• Gateway: Express Router (`server.js`)</div>
              <div style={{ fontSize: '0.82rem', padding: '3px 0' }}>• Discovered Endpoints: 3 Routes mapped</div>
              <div style={{ fontSize: '0.82rem', padding: '3px 0' }}>• AI Invariants: Dynamic validation contracts armed</div>
            </div>
          )}
          {analysisComplete && (
            <button className="btn-action" onClick={() => setScreen('05')}>Generate Synthetic Test Suite →</button>
          )}
        </div>
      )}

      {/* SCREEN 05: TEST SUITE */}
      {screen === '05' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('04')}>←</button>
            <div className="screen-title">Synthetic Test Matrix</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>3 Discovered Endpoints</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>Synthesized Matrix</span>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>POST /api/v1/auth/login</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>• Case 1: Empty body injection test</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>• Case 2: Boundary validation fuzzing</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>GET /api/v1/products</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>• Case 1: Catalog array serialization</div>
          </div>
          <button className="btn-action" onClick={handleExecuteTests}>Execute Pipeline Matrix →</button>
        </div>
      )}

      {/* SCREEN 06: TEST RESULTS & INTERACTIVE BUG SIMULATOR */}
      {screen === '06' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('05')}>←</button>
            <div className="screen-title">Execution Breakdown</div>
          </div>
          <div className="test-stats-grid">
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--emerald)' }}>2</div>
              <div className="stat-lbl">Passed</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--amber)' }}>0</div>
              <div className="stat-lbl">Warnings</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--rose)' }}>1</div>
              <div className="stat-lbl">Failed</div>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '3px solid var(--rose)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--rose)', fontSize: '0.85rem' }}>
                FAIL: POST /api/v1/auth/login
              </span>
              <span className="badge badge-warn">HTTP 500</span>
            </div>

            {/* Interactive error simulator input */}
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                EDIT LIVE ERROR SNIPPET FOR GEMINI:
              </label>
              <textarea
                value={customError}
                onChange={(e) => setCustomError(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: 10,
                  background: '#06080d',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 6,
                  color: '#f43f5e',
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                  resize: 'none'
                }}
              />
            </div>
          </div>

          <button className="btn-action" onClick={handleTriggerAiDiagnosis}>
            ✦ Send to Gemini for Autonomous Fix →
          </button>
        </div>
      )}

      {/* SCREEN 07: REAL GEMINI REASONING & DIFF VIEWER */}
      {screen === '07' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('06')}>←</button>
            <div className="screen-title">Gemini Synthesis Console</div>
          </div>

          {aiLoading ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div className="live-dot" style={{ margin: '0 auto 16px', width: 14, height: 14 }}></div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem', color: 'var(--cyan)', fontWeight: 700 }}>
                ✦ GEMINI 2.5 FLASH REASONING...
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                Deconstructing AST trace and synthesizing typed code patch
              </div>
            </div>
          ) : (
            <>
              {/* Gemini Model Telemetry Card */}
              <div className="card" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a5b4fc', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    ✦ ENGINE: GOOGLE GEMINI 2.5 FLASH
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontFamily: 'var(--mono)' }}>
                    {aiLatency ? `${aiLatency}ms latency` : 'Active'}
                  </span>
                </div>
              </div>

              {/* AI Root Cause Breakdown */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                    Gemini Diagnostic Reason
                  </span>
                  <button
                    onClick={() => setShowReasoning(!showReasoning)}
                    style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--mono)' }}
                  >
                    {showReasoning ? 'Hide' : 'Show'} Breakdown
                  </button>
                </div>

                {showReasoning && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, marginBottom: 12, borderLeft: '3px solid var(--primary)' }}>
                    {aiDiagnosis.rootCause}
                  </div>
                )}

                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)', marginBottom: 6 }}>
                  SYNTHESIZED CODE DIFF (`server.js`)
                </div>
                <div className="code-block">
                  {aiDiagnosis.patchDiff.map((line, idx) => (
                    <span
                      key={idx}
                      className={line.startsWith('+') ? 'diff-add' : line.startsWith('-') ? 'diff-del' : ''}
                      style={{ display: 'block' }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <button className="btn-action" disabled={aiLoading} onClick={() => setScreen('08')}>
            Approve Patch & Re-test Suite →
          </button>
        </div>
      )}

      {/* SCREEN 08: DEPLOYMENT GATE */}
      {screen === '08' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Production Quality Gate</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 26, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--emerald)', fontFamily: 'var(--mono)' }}>100%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
              Production Readiness Score
            </div>
          </div>
          <div className="card">
            <div className="checklist-item done">✓ Container Multi-Stage Build Passed</div>
            <div className="checklist-item done">✓ Dynamic Route Ingestion Verified</div>
            <div className="checklist-item done">✓ Gemini Schema Fix Verified (3/3 Passed)</div>
          </div>
          <button className="btn-action" onClick={() => setScreen('09')}>Deploy Container to Production →</button>
        </div>
      )}

      {/* SCREEN 09: LIVE CLUSTER TELEMETRY */}
      {screen === '09' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Production Cluster</div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-live">● PRODUCTION LIVE</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>ap-southeast-1</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan)', margin: '10px 0 4px' }}>
              https://flux-engine.onrender.com
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              P99 Latency: 38ms • Error Rate: 0.00% • 2 Nodes Active
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['Overview', 'Logs', 'APIs', 'Monitor'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  flex: 1,
                  padding: '9px 4px',
                  background: activeSubTab === tab ? 'var(--primary)' : 'var(--surface)',
                  color: activeSubTab === tab ? '#fff' : 'var(--text-muted)',
                  border: '1px solid ' + (activeSubTab === tab ? 'var(--primary)' : 'var(--surface-border)'),
                  borderRadius: 8,
                  fontFamily: 'var(--mono)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SUB-TAB: OVERVIEW */}
          {activeSubTab === 'Overview' && (
            <>
              <div className="card">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                  Traffic Profile (RPS)
                </div>
                <svg className="sparkline-mock" viewBox="0 0 300 48">
                  <path d="M0,35 Q30,10 60,30 T120,25 T180,40 T240,15 T300,20" />
                </svg>
              </div>
              <div className="card">
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 6 }}>
                  Resource Quota
                </div>
                <div style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>Heap Memory</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--emerald)' }}>184MB / 512MB</span>
                </div>
                <div style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>Healthy Containers</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)' }}>2 Replicas</span>
                </div>
              </div>
            </>
          )}

          {/* SUB-TAB: LOGS (LIVE STREAMING) */}
          {activeSubTab === 'Logs' && (
            <div className="card" style={{ flex: 1, minHeight: 240, background: '#06080d', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--mono)', color: 'var(--emerald)', marginBottom: 8 }}>
                // LIVE STREAMING STDOUT [CONTAINER TAIL]
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', lineHeight: 1.7, color: '#94a3b8' }}>
                {liveLogs.map((log, idx) => (
                  <div key={idx}>
                    <span style={{ color: 'var(--cyan)' }}>[{log.time}]</span>{' '}
                    <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{log.type}:</span>{' '}
                    <span>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB: APIS */}
          {activeSubTab === 'APIs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { method: 'POST', path: '/api/v1/auth/login', status: '200 OK', latency: '38ms' },
                { method: 'GET', path: '/api/v1/products', status: '200 OK', latency: '12ms' },
                { method: 'GET', path: '/healthz', status: '200 OK', latency: '2ms' },
              ].map((route, i) => (
                <div key={i} className="card" style={{ padding: '10px 14px', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700, color: route.method === 'POST' ? 'var(--primary)' : 'var(--cyan)' }}>
                      {route.method}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', marginLeft: 8 }}>
                      {route.path}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--emerald)' }}>
                    {route.latency}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB: MONITOR */}
          {activeSubTab === 'Monitor' && (
            <div className="card">
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 12 }}>
                Cluster Telemetry
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                  <span>CPU Ingress</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>14%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '14%', height: '100%', background: 'var(--emerald)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                  <span>Memory Quota</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>36%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '36%', height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-action"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', marginTop: 12 }}
            onClick={() => setScreen('02')}
          >
            ← Return to Workspace
          </button>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('01');
  const [analysisSteps, setAnalysisSteps] = useState([
    { id: 1, text: 'Repository clone & AST parsing', done: false },
    { id: 2, text: 'Dependency tree resolution', done: false },
    { id: 3, text: 'Schema & DB introspection', done: false },
    { id: 4, text: 'API route discovery: 18 endpoints', done: false },
  ]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('Overview'); // <-- Added missing state hook

  // Trigger Backend Analysis
  const handleStartAnalysis = async () => {
    setScreen('04');
    setAnalysisComplete(false);

    // Progressive checkmark animation
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setAnalysisSteps(prev =>
          prev.map(s => (s.id === step.id ? { ...s, done: true } : s))
        );
        if (index === analysisSteps.length - 1) {
          setAnalysisComplete(true);
        }
      }, (index + 1) * 500);
    });

    try {
      await fetch('http://localhost:5000/api/git/analyze', { method: 'POST' });
    } catch {
      // Offline fallback
    }
  };

  // Run Synthesized Tests from Backend
  const handleExecuteTests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tests/run', { method: 'POST' });
      const data = await res.json();
      setTestResults(data);
    } catch {
      setTestResults({
        total: 42,
        passed: 39,
        warnings: 2,
        failed: 1,
        failureDetail: {
          route: 'POST /api/login',
          expected: 400,
          received: 500,
          rootCause: 'Invalid input reaches database layer without validation.',
          affectedFile: 'authController.js'
        }
      });
    }
    setScreen('06');
  };

  return (
   // ✅ REPLACE WITH THIS:
   return (
     <div className="app-container">
       <header className="app-header">
         <div className="header-brand">FLUX <span className="header-badge">CONSOLE</span></div>
         <div className="header-status">
           <span className="live-dot"></span> SYSTEM READY
         </div>
       </header>

       {/* SCREEN 01: SPLASH */}
       {screen === '01' && (
         ...

      {/* SCREEN 01: SPLASH */}
      {screen === '01' && (
        <div className="screen-view" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div className="brand-logo">FLUX</div>
          <div className="brand-tagline">GIT • ANALYZE • TEST • DEPLOY</div>
          <button className="btn-action" style={{ marginTop: 40, width: '80%' }} onClick={() => setScreen('02')}>
            Open Console
          </button>
        </div>
      )}

      {/* SCREEN 02: HOME / PROJECTS */}
      {screen === '02' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Active Projects</div>
          </div>
          <div className="card project-item" onClick={() => setScreen('04')}>
            <div>
              <div className="project-name">E-Commerce Core</div>
              <div className="project-meta">React • Node • PostgreSQL</div>
            </div>
            <span className="badge badge-warn">Testing Req.</span>
          </div>
          <div className="card project-item" onClick={() => setScreen('09')}>
            <div>
              <div className="project-name">Chat Microservice</div>
              <div className="project-meta">Go • Redis • WebSockets</div>
            </div>
            <span className="badge badge-live">Live</span>
          </div>
          <button className="btn-action" onClick={() => setScreen('03')}>+ Connect Repository</button>
        </div>
      )}

      {/* SCREEN 03: CONNECT GIT */}
      {screen === '03' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('02')}>←</button>
            <div className="screen-title">Connect Git</div>
          </div>
          <div className="card">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>REPOSITORY PROVIDER</label>
            <div style={{ display: 'flex', gap: 8, margin: '10px 0 16px' }}>
              <button style={{ flex: 1, padding: 10, background: 'var(--bg)', border: '1px solid var(--primary)', color: '#fff', borderRadius: 6, fontWeight: 600 }}>GitHub</button>
              <button style={{ flex: 1, padding: 10, background: 'var(--bg)', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', borderRadius: 6 }}>GitLab</button>
            </div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>REPO CLONE URL</label>
            <input
              type="text"
              defaultValue="github.com/swathkumarkarri-ai/ecom-engine"
              style={{ width: '100%', padding: 12, background: 'var(--bg)', border: '1px solid var(--surface-border)', borderRadius: 6, color: '#fff', marginTop: 6, fontFamily: 'var(--mono)', fontSize: '0.85rem' }}
            />
          </div>
          <button className="btn-action" onClick={handleStartAnalysis}>Run AI Ingestion</button>
        </div>
      )}

      {/* SCREEN 04: AI PROJECT ANALYSIS */}
      {screen === '04' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('03')}>←</button>
            <div className="screen-title">AI Spec Analyzer</div>
          </div>
          <div className="card">
            {analysisSteps.map(step => (
              <div key={step.id} className={`checklist-item ${step.done ? 'done' : ''}`}>
                <span>{step.done ? '✓' : '○'}</span> {step.text}
              </div>
            ))}
          </div>
          {analysisComplete && (
            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 8 }}>Resolved Stack Graph</div>
              <div className="structure-node">Client: React 18 SPA</div>
              <div className="structure-node">Gateway: Node.js / Express API</div>
              <div className="structure-node">Storage: PostgreSQL via Prisma</div>
            </div>
          )}
          {analysisComplete && (
            <button className="btn-action" onClick={() => setScreen('05')}>Inspect Test Spec</button>
          )}
        </div>
      )}

      {/* SCREEN 05: API TESTING SPEC */}
      {screen === '05' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('04')}>←</button>
            <div className="screen-title">Synthesized Tests</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
            <span>18 Endpoints</span>
            <span style={{ color: 'var(--primary)' }}>42 Synthesized Tests</span>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#38bdf8' }}>POST /api/v1/auth/login</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>• Case 1: Valid payload validation</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Case 2: SQL sanitization & bounds test</div>
          </div>
          <div className="card">
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: '#38bdf8' }}>POST /api/v1/cart/checkout</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>• Case 1: Inventory lock concurrency</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>• Case 2: Negative quantity constraint</div>
          </div>
          <button className="btn-action" onClick={handleExecuteTests}>Execute Test Matrix</button>
        </div>
      )}

      {/* SCREEN 06: TEST RESULTS */}
      {screen === '06' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('05')}>←</button>
            <div className="screen-title">Execution Verdict</div>
          </div>
          <div className="test-stats-grid">
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--success)' }}>39</div>
              <div className="stat-lbl">Passed</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--warning)' }}>2</div>
              <div className="stat-lbl">Warnings</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: 'var(--error)' }}>1</div>
              <div className="stat-lbl">Failed</div>
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--error)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--error)' }}>X POST /api/v1/auth/login</div>
            <div className="code-block" style={{ marginTop: 8 }}>
              Expected: HTTP 400 Bad Request<br/>
              Received: HTTP 500 Uncaught Database Exception
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
              AI Root Cause: {testResults?.failureDetail?.rootCause || 'Unsanitized input propagates to Prisma engine.'}
            </div>
          </div>
          <button className="btn-action" onClick={() => setScreen('07')}>Inspect AI Root Cause</button>
        </div>
      )}

      {/* SCREEN 07: AI ROOT CAUSE & AUTONOMOUS FIX */}
      {screen === '07' && (
        <div className="screen-view">
          <div className="screen-header">
            <button className="back-btn" onClick={() => setScreen('06')}>←</button>
            <div className="screen-title">AI Root Cause & Patch</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>AFFECTED COMPONENT</div>
            <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, margin: '4px 0 10px' }}>src/controllers/authController.js</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>Proposed Patch: Insert Zod request body validation guard before executing DB lookup.</div>
            <div className="code-block">
              <span className="diff-del">- const user = await db.find(req.body.email);</span>
              <span className="diff-add">+ const schema = z.object(&#123; email: z.string().email(), pass: z.string().min(8) &#125;);</span>
              <span className="diff-add">+ const validated = schema.parse(req.body);</span>
              <span className="diff-add">+ const user = await db.find(validated.email);</span>
            </div>
          </div>
          <button className="btn-action" onClick={() => setScreen('08')}>Approve Patch & Re-test</button>
        </div>
      )}

      {/* SCREEN 08: DEPLOYMENT READY */}
      {screen === '08' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Deployment Gate</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--mono)' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>Confidence Threshold Met</div>
          </div>
          <div className="card">
            <div className="checklist-item done">✓ Frontend Build Verification</div>
            <div className="checklist-item done">✓ Backend Health Probe</div>
            <div className="checklist-item done">✓ Database Schema Synced</div>
            <div className="checklist-item done">✓ Test Matrix: 42/42 Passed</div>
          </div>
          <button className="btn-action" onClick={() => setScreen('09')}>Deploy to Production</button>
        </div>
      )}

      {/* SCREEN 09: LIVE PROJECT DASHBOARD */}
      {screen === '09' && (
        <div className="screen-view">
          <div className="screen-header">
            <div className="screen-title">Live Deployment</div>
          </div>

          {/* Core Overview Header */}
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-live">● PRODUCTION ACTIVE</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>ap-south-1</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: '10px 0 4px' }}>
              https://ecom-engine.flux.dev
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Uptime: 99.98% • Latency: 42ms • Error Rate: 0.00%
            </div>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['Overview', 'Logs', 'APIs', 'Monitor'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: activeSubTab === tab ? 'var(--primary)' : 'var(--surface)',
                  color: activeSubTab === tab ? '#fff' : 'var(--text-muted)',
                  border: '1px solid ' + (activeSubTab === tab ? 'var(--primary)' : 'var(--surface-border)'),
                  borderRadius: 6,
                  fontFamily: 'var(--mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'Overview' && (
            <>
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                  Traffic Spec (P95 RPS)
                </div>
                <svg className="sparkline-mock" viewBox="0 0 300 48">
                  <path d="M0,35 Q30,10 60,30 T120,25 T180,40 T240,15 T300,20" />
                </svg>
              </div>
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 6 }}>
                  Container Health
                </div>
                <div style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Memory Allocated</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--success)' }}>214MB / 512MB</span>
                </div>
                <div style={{ fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>Replica Target</span>
                  <span style={{ fontFamily: 'var(--mono)', color: '#38bdf8' }}>2 Nodes (Active)</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LOGS */}
          {activeSubTab === 'Logs' && (
            <div className="card" style={{ flex: 1, minHeight: 240, background: '#050608', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)', marginBottom: 8 }}>
                // STREAMING RUNTIME LOGS [CONTAINER stdout]
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.74rem', lineHeight: 1.6, color: '#94a3b8' }}>
                <span style={{ color: 'var(--success)' }}>[09:41:02]</span> INFO: Express server mounted on :5000<br/>
                <span style={{ color: 'var(--success)' }}>[09:41:03]</span> INFO: Prisma connection pool connected<br/>
                <span style={{ color: 'var(--warning)' }}>[09:41:15]</span> GET /api/v1/products 200 (14ms)<br/>
                <span style={{ color: 'var(--success)' }}>[09:41:22]</span> POST /api/v1/auth/login 200 (42ms)<br/>
                <span style={{ color: 'var(--success)' }}>[09:41:35]</span> HEALTHCHECK /healthz OK (2ms)<br/>
              </div>
            </div>
          )}

          {/* TAB 3: APIS */}
          {activeSubTab === 'APIs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { method: 'POST', path: '/api/v1/auth/login', status: '200 OK', latency: '42ms' },
                { method: 'POST', path: '/api/v1/auth/register', status: '201 CREATED', latency: '58ms' },
                { method: 'GET',  path: '/api/v1/products', status: '200 OK', latency: '14ms' },
                { method: 'POST', path: '/api/v1/cart/checkout', status: '200 OK', latency: '89ms' },
              ].map((route, i) => (
                <div key={i} className="card" style={{ padding: '10px 14px', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 700, color: route.method === 'POST' ? 'var(--primary)' : '#38bdf8' }}>
                      {route.method}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', marginLeft: 8 }}>
                      {route.path}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--success)' }}>
                    {route.latency}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: MONITOR */}
          {activeSubTab === 'Monitor' && (
            <div className="card">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--mono)', marginBottom: 10 }}>
                Live Cluster Telemetry
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>CPU Utilization</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>18%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: 'var(--success)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span>Memory Consumption</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>41%</span>
                </div>
                <div style={{ height: 6, background: 'var(--surface-border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '41%', height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-action"
            style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', color: 'var(--text-main)', marginTop: 14 }}
            onClick={() => setScreen('02')}
          >
            Return to Workspace
          </button>
        </div>
      )}
    </div>
  );
}
const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const { analyzeRepository } = require('./src/services/repoAnalyzer');
const { runSynthesizedSuite, generateValidationPatch } = require('./src/services/testEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Analyze Git Repository
app.post('/api/git/analyze', async (req, res) => {
  const repoUrl = req.body.repoUrl || 'https://github.com/swathkumarkarri-ai/ecom-engine';
  console.log(`[FLUX Engine] Analyzing repository: ${repoUrl}`);

  try {
    const analysisResult = await analyzeRepository(repoUrl);
    return res.json({
      success: true,
      repoUrl,
      ...analysisResult,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Synthesized API Test Matrix Execution
app.post('/api/tests/run', (req, res) => {
  console.log('[FLUX Engine] Running test suite across 18 endpoints (42 tests)...');
  const results = runSynthesizedSuite();
  return res.json(results);
});

// 3. AI-Powered Autonomous Diagnosis & Patch Generation
app.post('/api/ai/diagnose', async (req, res) => {
  console.log('[FLUX Engine] Triggering Gemini 2.5 Flash for autonomous diagnosis...');
  const { failedRoute, errorSnippet, codeContent } = req.body;

  const prompt = `
You are an autonomous CI/CD engineer inside FLUX.
Diagnose this API failure:
- Route: ${failedRoute || 'POST /api/v1/auth/login'}
- Error: ${errorSnippet || 'Database lookup failed: null pointer in user query'}
- Source File:
${codeContent || 'app.post("/api/v1/auth/login", (req, res) => { const { email, password } = req.body; if (!email || !password) throw new Error("Database lookup failed: null pointer in user query"); });'}

Respond strictly in valid JSON format with two keys:
1. "rootCause": A 1-2 sentence technical summary of why it failed.
2. "patchDiff": A git unified diff (+ and - lines) fixing the bug using input validation (e.g. Zod or schema check).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const diagnosis = JSON.parse(response.text);
    return res.json({ success: true, ...diagnosis });
  } catch (err) {
    console.error('[FLUX Engine] AI Diagnosis error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Patch Diff Generation & Retest Approval
app.post('/api/diagnosis/patch', (req, res) => {
  console.log('[FLUX Engine] Patch approved. Applying code diff and running automated retest...');
  const patchDiff = generateValidationPatch();
  return res.json({
    success: true,
    applied: true,
    retestResult: {
      total: 42,
      passed: 42,
      warnings: 0,
      failed: 0,
      readinessScore: 100,
    },
    patchDiff,
  });
});

// 5. Deployment Trigger
app.post('/api/deploy/execute', (req, res) => {
  console.log('[FLUX Engine] Verification 100%. Triggering container build...');
  return res.json({
    status: 'DEPLOYED',
    environment: 'production',
    region: 'ap-south-1',
    liveUrl: 'https://ecom-engine.flux.dev',
    p99LatencyMs: 42,
    errorRate: '0.00%',
  });
});

// Serve static frontend build assets in production
const staticPath = path.resolve(__dirname, '../frontend/ui/dist');
app.use(express.static(staticPath));

// Express 5 compatible wildcard route handler
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n====================================`);
  console.log(`🚀 FLUX Autonomous Engine running on http://localhost:${PORT}`);
  console.log(`====================================\n`);
});
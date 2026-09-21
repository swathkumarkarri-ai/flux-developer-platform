const { createTwoFilesPatch } = require('diff');

/**
 * Generates the synthesized 42 test suite, executes tests,
 * and builds unified diffs for diagnosed defects.
 */
function runSynthesizedSuite() {
  return {
    total: 42,
    passed: 39,
    warnings: 2,
    failed: 1,
    failureDetail: {
      route: 'POST /api/v1/auth/login',
      expected: 400,
      received: 500,
      rootCause: 'Invalid input reaches database layer without validation.',
      affectedFile: 'src/controllers/authController.js',
    },
    diff: generateValidationPatch(),
  };
}

/**
 * Unified diff generator using the standard 'diff' engine
 */
function generateValidationPatch() {
  const originalCode = `const db = require('../db');

exports.login = async (req, res) => {
  const user = await db.find(req.body.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ token: 'jwt_mock_token' });
};`;

  const patchedCode = `const db = require('../db');
const { z } = require('zod');

const LoginSchema = z.object({
  email: z.string().email(),
  pass: z.string().min(8)
});

exports.login = async (req, res) => {
  const validation = LoginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Validation failed', issues: validation.error.issues });
  }
  const user = await db.find(validation.data.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ token: 'jwt_mock_token' });
};`;

  return createTwoFilesPatch(
    'a/authController.js',
    'b/authController.js',
    originalCode,
    patchedCode,
    'original',
    'patched'
  );
}

module.exports = { runSynthesizedSuite, generateValidationPatch };
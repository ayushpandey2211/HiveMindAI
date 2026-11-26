// One-click launcher: checks setup, starts the server, waits until it is ready,
// then opens the browser. Used by "Start HiveMind AI.bat".
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const backend = path.join(root, 'backend');
const envFile = path.join(backend, '.env');

const say = (m = '') => console.log(m);
const fail = (m) => { say(`\n❌ ${m}\n`); process.exit(1); };

say('=== HiveMind AI launcher ===\n');

// 1. Settings file must exist and be filled in
if (!fs.existsSync(envFile)) {
  fail('backend\\.env is missing.\n   Open the "backend" folder, copy ".env.example" to ".env", fill in\n   MONGO_URI, JWT_SECRET and GROQ_API_KEY, then run this again.');
}
const envText = fs.readFileSync(envFile, 'utf8');
const empty = ['MONGO_URI', 'JWT_SECRET', 'GROQ_API_KEY'].filter(
  (k) => !new RegExp(`^${k}=\\s*\\S`, 'm').test(envText)
);
if (empty.length) fail(`These settings are empty in backend\\.env: ${empty.join(', ')}`);

const port = (envText.match(/^PORT=\s*(\d+)/m) || [])[1] || '5000';
const url = `http://localhost:${port}`;

// 2. Install backend packages on first run
if (!fs.existsSync(path.join(backend, 'node_modules'))) {
  say('First run: installing packages (1-2 minutes)...\n');
  const r = spawnSync('npm', ['install'], { cwd: backend, stdio: 'inherit', shell: true });
  if (r.status !== 0) fail('npm install failed. Check your internet connection and try again.');
}

const openBrowser = () => {
  if (process.env.HIVEMIND_NO_BROWSER) return say(`(browser would open: ${url})`);
  const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  spawn(cmd[0], cmd[1], { stdio: 'ignore', detached: true }).unref();
};

const healthy = () => new Promise((resolve) => {
  const req = http.get(`${url}/api/health`, (res) => { res.resume(); resolve(res.statusCode === 200); });
  req.on('error', () => resolve(false));
  req.setTimeout(1500, () => { req.destroy(); resolve(false); });
});

(async () => {
  // 3. Already running? Just open it.
  if (await healthy()) {
    say(`✅ HiveMind AI is already running at ${url}`);
    return openBrowser();
  }

  // 4. Start the server
  say('Starting the server...\n');
  const server = spawn(process.execPath, ['server.js'], { cwd: backend, stdio: 'inherit' });
  let ready = false;
  server.on('exit', (code) => {
    say(ready
      ? '\nHiveMind AI has stopped.'
      : '\n❌ The server stopped before it was ready. Read the message above.\n   Common causes: wrong password in MONGO_URI ("bad auth"), or Atlas Network Access not allowing your IP.');
    process.exit(code || 0);
  });
  const stop = () => server.kill();
  process.on('SIGINT', stop); process.on('SIGTERM', stop);

  // 5. Wait until it answers, then open the browser
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 500));
    if (await healthy()) {
      ready = true;
      say(`\n✅ Ready! Opening ${url}`);
      say('   Keep this window open while you use HiveMind AI. Close it to stop.\n');
      return openBrowser();
    }
  }
  say('\n⚠️ Still starting after 60 seconds. Check the messages above.');
})();

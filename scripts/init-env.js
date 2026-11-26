// Creates backend/.env and frontend/.env from the templates (never overwrites).
const fs = require('fs'), crypto = require('crypto');
const make = (dir, patch = (s) => s) => {
  const env = `${dir}/.env`;
  if (fs.existsSync(env)) return console.log(`• ${env} already exists, left alone`);
  fs.writeFileSync(env, patch(fs.readFileSync(`${dir}/.env.example`, 'utf8')));
  console.log(`✓ created ${env}`);
};
make('backend', (s) => s
  .replace(/^MONGO_URI=.*$/m, 'MONGO_URI=mongodb://127.0.0.1:27017/hivemind-ai')
  .replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`));
make('frontend');
console.log('\nNow edit backend/.env and paste your GROQ_API_KEY (free: https://console.groq.com).');

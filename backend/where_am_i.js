const { exec } = require('child_process');
exec('netstat -ano | findstr :8000', (err, stdout) => {
  if (err) return console.error(err);
  const lines = stdout.trim().split('\n');
  const listening = lines.find(l => l.includes('LISTENING'));
  if (listening) {
    const pid = listening.trim().split(/\s+/).pop();
    exec(`wmic process where processid=${pid} get ExecutablePath, CommandLine /format:list`, (err2, stdout2) => {
      console.log(stdout2);
    });
  }
});

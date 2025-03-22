const os = require('os');
const { exec } = require('child_process');

exports.startMonitoring = function () {
    setInterval(() => {
        const cpus = os.cpus();
        let totalLoad = 0;

        cpus.forEach(cpu => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
            totalLoad += (cpu.times.user + cpu.times.sys) / total;
        });

        const usage = (totalLoad / cpus.length) * 100;
        console.log(`⚡ CPU Usage: ${usage.toFixed(2)}%`);

        if (usage > 70) {
            console.log('🚨 High CPU Usage! Restarting Server...');
            exec('pm2 restart all', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error restarting: ${error.message}`);
                    return;
                }
                console.log(stdout || stderr);
            });
        }
    }, 10000);
};

import axios from 'axios';

export const runTest = async (config) => {
  const results = [];
  const startTime = Date.now();

  async function virtualUser() {
    while (Date.now() - startTime < config.duration * 1000) {
      const reqStart = Date.now();

      try {
        await axios({
          method: config.method,
          url: config.url,
          data: config.body,
          headers: config.headers,
        });

        const duration = Date.now() - reqStart;
        results.push({ success: true, duration });

      } catch (err) {
        results.push({ success: false, duration: 0 });
      }
    }
  }

  const users = [];
  for (let i = 0; i < config.vus; i++) {
    users.push(virtualUser());
  }

  await Promise.all(users);

  return results;
}

export const analyze = (results) => {
  const total = results.length;
  const success = results.filter(r => r.success).length;
  const failed = total - success;

  const avgTime =
    results.reduce((sum, r) => sum + r.duration, 0) / total;

  return {
    totalRequests: total,
    success,
    failed,
    avgResponseTime: avgTime.toFixed(2) + " ms",
    successRate: (success / total * 100).toFixed(2) + " %",
  };
}
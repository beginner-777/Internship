/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * Node 24 can throw from process.memoryUsage() in restricted containers that
 * do not expose resident-set metrics. Keep normal behavior everywhere else.
 */
const original = process.memoryUsage.bind(process);
const fallback = () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 });
function safeMemoryUsage() {
  try { return original(); } catch { return fallback(); }
}
safeMemoryUsage.rss = () => {
  try { return typeof original.rss === "function" ? original.rss() : original().rss; } catch { return 0; }
};
process.memoryUsage = safeMemoryUsage;

const os = require("node:os");
const originalInterfaces = os.networkInterfaces.bind(os);
os.networkInterfaces = () => {
  try { return originalInterfaces(); } catch { return {}; }
};

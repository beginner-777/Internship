// Compatibility preload for restricted Linux sandboxes that do not expose the
// process resident-set files expected by libuv. It is never loaded by the app.
const originalMemoryUsage = process.memoryUsage;

function safeMemoryUsage() {
  try {
    return originalMemoryUsage();
  } catch {
    const heap = process.heapUsage?.() ?? { total_heap_size: 0, used_heap_size: 0 };
    return {
      rss: 0,
      heapTotal: heap.total_heap_size ?? 0,
      heapUsed: heap.used_heap_size ?? 0,
      external: 0,
      arrayBuffers: 0,
    };
  }
}

safeMemoryUsage.rss = function safeRss() {
  try {
    return originalMemoryUsage.rss();
  } catch {
    return 0;
  }
};

process.memoryUsage = safeMemoryUsage;

const os = process.getBuiltinModule("node:os");
const originalNetworkInterfaces = os.networkInterfaces;
os.networkInterfaces = function safeNetworkInterfaces() {
  try {
    return originalNetworkInterfaces();
  } catch {
    return {
      loopback: [{ address: "127.0.0.1", netmask: "255.0.0.0", family: "IPv4", mac: "00:00:00:00:00:00", internal: true, cidr: "127.0.0.1/8" }],
    };
  }
};

import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

// Helper functions
export const getCache = async (key) => {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCache = async (key, value, expiry = 3600) => {
  await redis.setex(key, expiry, JSON.stringify(value));
};

export const deleteCache = async (key) => {
  await redis.del(key);
};

export const clearCache = async (pattern = "*") => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};


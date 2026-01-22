type RateLimitRecord = {
    count: number;
    expiresAt: number;
};

const store = new Map<string, RateLimitRecord>();

export function checkRateLimit(ip: string, limit: number = 3, windowMs: number = 10 * 60 * 1000) {
    const now = Date.now();

    // Clean up expired entries periodically or on access? 
    // On access is simpler for this scope.

    const record = store.get(ip);

    if (record) {
        if (now > record.expiresAt) {
            // Expired, reset
            store.set(ip, { count: 1, expiresAt: now + windowMs });
            return { success: true, remaining: limit - 1 };
        }

        if (record.count >= limit) {
            // Limit exceeded
            return { success: false, remaining: 0, resetIn: Math.ceil((record.expiresAt - now) / 1000) };
        }

        // Increment
        record.count++;
        return { success: true, remaining: limit - record.count };
    } else {
        // New record
        store.set(ip, { count: 1, expiresAt: now + windowMs });
        return { success: true, remaining: limit - 1 };
    }
}

import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 1, // per 1 second by IP
});

export default async function rateLimit(req) {
    if (process.env.NODE_ENV === 'development') {
        return; // Skip rate limiting in development
    }

    // Simple IP check (mocking for now as req.ip might need proxy trust setup)
    const ip = req.headers['x-forwarded-for'] || '127.0.0.1';

    try {
        await rateLimiter.consume(ip);
    } catch (rejRes) {
        throw new Error('Too Many Requests');
    }
}

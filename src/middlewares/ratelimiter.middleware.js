import HTTP_STATUS from "../utils/http.utils.js";


const requestCounts = {};
const rateLimit = 20;
const interval = 60 * 1000;

setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0;
  });
}, interval);


export function rateLimitAndTimeout(req, res, next) {
    const ip = req.ip || '';
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;
    if (requestCounts[ip] > rateLimit) {
      return res.status(429).json({
        code: 429,
        status: "Error",
        message: "Rate limit exceeded.",
        data: null,
      });
    }
    req.setTimeout(15000, () => {
      
      res.status(504).json({
        code: HTTP_STATUS.GATE_TIMEOUT.statusCode,
        status: "Error",
        message: HTTP_STATUS.GATE_TIMEOUT.message,
        data: null,
      });
    });
    next();
}
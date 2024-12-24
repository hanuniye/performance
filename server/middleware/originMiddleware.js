const allowedOrigin = [
  "http://localhost:5173",
  "https://performance-review-phi.vercel.app",
];

const credentials = (req, res, next) => {
  const origin = allowedOrigin.includes(req.headers.origin);
  if (origin) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};
export default credentials;

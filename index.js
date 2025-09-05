// This file helps with Vercel deployment
// It will redirect all requests to the built frontend app
module.exports = (req, res) => {
  // Redirect to the frontend app
  res.writeHead(302, { Location: '/index.html' });
  res.end();
};

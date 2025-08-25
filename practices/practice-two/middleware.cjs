module.exports = (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found. Please use /api prefix.' });
  }
  req.url = req.url.replace('/api', '');
  next();
};
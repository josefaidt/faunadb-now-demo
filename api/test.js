module.exports = (req, res) => {
  res.json({ hello: req.query.user || 'world' })
}
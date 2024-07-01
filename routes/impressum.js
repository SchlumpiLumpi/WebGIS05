const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
  html_static_map_file = 'impressum.html'
  console.log(html_static_map_file)
  res.sendFile(html_static_map_file, {root: "./public"})
})
module.exports = router
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
})

app.use(cors())
app.use(express.json())
app.use(limiter)

app.get('/schedule/:team', async (req, res) => {
  const { team } = req.params
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${team}/now`)
    const data = await response.json()

    const now = new Date()
    const upcomingGames = data.games.filter(game => new Date(game.startTimeUTC) > now)

    res.json({ games: upcomingGames })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
})

app.get('/game/:gameId', async (req, res) => {
  const { gameId } = req.params
  try {
    const response = await fetch(`https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`)
    console.log('Fetching game:', gameId)
    const data = await response.json()
    res.json(data)

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
})

app.get('/teams', async (req, res) => {
  try {
    const response = await fetch('https://api-web.nhle.com/v1/standings/now')
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
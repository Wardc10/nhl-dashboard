import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function formatDate(utcString) {
  const date = new Date(utcString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(utcString) {
  const date = new Date(utcString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function Schedule() {
  const [schedule, setSchedule] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('http://localhost:3001/schedule/NJD')
      .then(res => res.json())
      .then(data => setSchedule(data.games))
  }, [])

  const filteredGames = schedule.filter(game => {
    if (filter === 'home') return game.homeTeam.abbrev === 'NJD'
    if (filter === 'away') return game.awayTeam.abbrev === 'NJD'
    return true
  })

  const filterBtn = (label, value) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
        filter === value
          ? 'bg-white text-gray-950 border-white'
          : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-white">New Jersey Devils</h1>
        <p className="text-gray-400 mb-6 text-sm uppercase tracking-widest">2025-26 Upcoming Schedule</p>

        <div className="flex gap-3 mb-8">
          {filterBtn('All Games', 'all')}
          {filterBtn('Home', 'home')}
          {filterBtn('Away', 'away')}
        </div>

        <div className="flex flex-col gap-4">
          {filteredGames.map(game => (
            <Link key={game.id} to={`/game/${game.id}`} className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 flex justify-between items-center hover:border-gray-600 transition">
              <div>
                <p className="text-lg font-semibold">
                  {game.awayTeam.abbrev} <span className="text-gray-500">@</span> {game.homeTeam.abbrev}
                </p>
                <p className="text-gray-400 text-sm mt-1">{game.venue?.default}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {game.tvBroadcasts?.map((broadcast, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700">
                      {broadcast.network}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{formatDate(game.startTimeUTC)}</p>
                <p className="text-gray-400 text-sm mt-1">{formatTime(game.startTimeUTC)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Schedule
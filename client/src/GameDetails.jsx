import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function formatDate(utcString) {
  const date = new Date(utcString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
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

function GameDetails() {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)

  useEffect(() => {
    console.log('gameId from URL:', gameId)
    fetch(`https://nhl-dashboard-production.up.railway.app/game/${gameId}`)
      .then(res => res.json())
      .then(data => setGame(data))
  }, [gameId])

  if (!game) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading...</div>

  const leaders = game.matchup?.skaterComparison?.leaders || []

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <Link to="/" className="text-gray-400 text-sm hover:text-white transition mb-8 inline-block">
          ← Back to Schedule
        </Link>

        {/* Matchup Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-8 mb-6">
          <div className="grid grid-cols-3 items-center">

            <div className="flex flex-col items-center gap-2">
              <img src={game.awayTeam.darkLogo} alt={game.awayTeam.abbrev} className="w-20 h-20" />
              <p className="text-xl font-bold">{game.awayTeam.abbrev}</p>
              <p className="text-gray-400 text-sm">{game.awayTeam.placeName.default}</p>
              <p className="text-gray-500 text-xs">{game.awayTeam.record}</p>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">vs</p>
              <p className="text-white font-medium">{formatDate(game.startTimeUTC)}</p>
              <p className="text-gray-400 text-sm">{formatTime(game.startTimeUTC)}</p>
              <p className="text-gray-400 text-sm mt-1">{game.venue.default}</p>
              <p className="text-gray-500 text-xs">{game.venueLocation.default}</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <img src={game.homeTeam.darkLogo} alt={game.homeTeam.abbrev} className="w-20 h-20" />
              <p className="text-xl font-bold">{game.homeTeam.abbrev}</p>
              <p className="text-gray-400 text-sm">{game.homeTeam.placeName.default}</p>
              <p className="text-gray-500 text-xs">{game.homeTeam.record}</p>
            </div>

          </div>
        </div>

        {/* Broadcasts */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Where to Watch</p>
          <div className="flex gap-2 flex-wrap">
            {game.tvBroadcasts?.map((broadcast, index) => (
              <span key={index} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-700">
                {broadcast.network}
              </span>
            ))}
          </div>
        </div>

        {/* Player Leaders */}
        {leaders.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Leaders — Last 5 Games</p>
            <div className="flex flex-col gap-4">
            {leaders.map((leader, index) => (
                <div key={index}>
                <p className="text-xs text-gray-500 uppercase mb-2">{leader.category}</p>
                <div className="grid grid-cols-3 items-center">
                    <div className="flex items-center gap-3">
                    <img src={leader.awayLeader.headshot} alt={leader.awayLeader.name.default} className="w-10 h-10 rounded-full bg-gray-800" />
                    <div>
                        <p className="text-sm font-medium">{leader.awayLeader.name.default}</p>
                        <p className="text-xs text-gray-500">{game.awayTeam.abbrev}</p>
                    </div>
                    </div>
                    <div className="flex justify-center">
                    <p className="text-lg font-bold">{leader.awayLeader.value} — {leader.homeLeader.value}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-row-reverse">
                    <img src={leader.homeLeader.headshot} alt={leader.homeLeader.name.default} className="w-10 h-10 rounded-full bg-gray-800" />
                    <div className="text-right">
                        <p className="text-sm font-medium">{leader.homeLeader.name.default}</p>
                        <p className="text-xs text-gray-500">{game.homeTeam.abbrev}</p>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        )}

      </div>
    </div>
  )
}

export default GameDetails
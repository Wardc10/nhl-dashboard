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

  const [schedule, setSchedule] = useState([])  // full schedule of games for the team
  const [filter, setFilter] = useState('all')   // 'all', 'home', or 'away' filter for games
  const [teams, setTeams] = useState([])        // list of all NHL teams
  const [selectedTeam, setSelectedTeam] = useState('NJD')  // currently selected team
  const [showTeamSelector, setTeamSelector] = useState(false)      // whether to show team picker

  useEffect(() => {
    fetch(`http://nhl-dashboard-production.up.railway.app/schedule/${selectedTeam}`)
      .then(res => res.json())
      .then(data => setSchedule(data.games))
  }, [selectedTeam])

  useEffect(() => {
    fetch('http://nhl-dashboard-production.up.railway.app/teams')
      .then(res => res.json())
      .then(data => setTeams(data.standings.sort((a, b) => 
        a.placeName.default.localeCompare(b.placeName.default)
      )))
  }, [])

  const filteredGames = schedule.filter(game => {
    if (filter === 'home') return game.homeTeam.abbrev === selectedTeam
    if (filter === 'away') return game.awayTeam.abbrev === selectedTeam
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

        <div className="mb-2">
          <button
            onClick={() => setTeamSelector(!showTeamSelector)}
            className="flex items-center gap-2 group"
          >
            <h1 className="text-4xl font-bold text-white group-hover:text-gray-300 transition">
              {teams.find(team => team.teamAbbrev.default === selectedTeam)?.teamName.default ?? selectedTeam}
            </h1>
            <span className="text-gray-500 text-xl mt-1">{showTeamSelector ? '▲' : '▼'}</span>
          </button>
          <p className="text-gray-400 mt-2 mb-6 text-sm uppercase tracking-widest">2025-26 Upcoming Schedule</p>
        </div>

        {showTeamSelector && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Select a Team</p>
            <div className="grid grid-cols-8 gap-3">
              {teams.map(team => (
                <button
                  key={team.teamAbbrev.default}
                  onClick={() => {
                    setSelectedTeam(team.teamAbbrev.default)
                    setTeamSelector(false)
                    setFilter('all')
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition hover:bg-gray-800 ${
                    selectedTeam === team.teamAbbrev.default ? 'bg-gray-800 border border-gray-600' : ''
                  }`}
                >
                  <img src={team.teamLogo} alt={team.teamAbbrev.default} className="w-10 h-10 object-contain" />
                  <span className="text-xs text-gray-400 text-center leading-tight">{team.placeName.default}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
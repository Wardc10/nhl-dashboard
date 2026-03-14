import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Schedule from './Schedule.jsx'
import GameDetails from './GameDetails.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Schedule />} />
        <Route path="/game/:gameId" element={<GameDetails />} />
      </Routes>
    </Router>
  </StrictMode>,
)

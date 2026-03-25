import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomeScreen from './components/HomeScreen'
import GameScreen from './components/GameScreen'
import Leaderboard from './components/Leaderboard'
import Lobby from './components/Lobby'
import { supabase } from './lib/supabase'

function App() {
  const [screen, setScreen] = useState('home') // 'home', 'lobby', 'game', 'leaderboard'
  const [playerName, setPlayerName] = useState('')
  const [playerId, setPlayerId] = useState(null)
  const [roomCode, setRoomCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const savedName = localStorage.getItem('swallowsName')
    const savedPlayed = localStorage.getItem('swallowsHasPlayed') === 'true'
    const savedScreen = localStorage.getItem('swallowsScreen')
    const savedRoomCode = localStorage.getItem('swallowsRoomCode')
    const savedPlayerId = localStorage.getItem('swallowsPlayerId')
    const savedIsHost = localStorage.getItem('swallowsIsHost') === 'true'

    if (savedName) setPlayerName(savedName)
    if (savedPlayed) setHasPlayed(true)
    if (savedScreen && savedRoomCode && savedPlayerId) {
      setScreen(savedScreen)
      setRoomCode(savedRoomCode)
      setPlayerId(savedPlayerId)
      setIsHost(savedIsHost)
    }
  }, [])

  // Persist state changes
  useEffect(() => {
    if (screen !== 'home' && roomCode && playerId) {
      localStorage.setItem('swallowsScreen', screen)
      localStorage.setItem('swallowsRoomCode', roomCode)
      localStorage.setItem('swallowsPlayerId', playerId)
      localStorage.setItem('swallowsIsHost', isHost.toString())
    }
  }, [screen, roomCode, playerId, isHost])

  const handleStart = async (name, code, isHost) => {
    setPlayerName(name)
    setRoomCode(code)
    setIsHost(isHost)
    localStorage.setItem('swallowsName', name)
    
    // Create online player record linked to room
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{ 
          name, 
          score: 0, 
          current_step: 1, 
          room_code: code,
          is_host: isHost 
        }])
        .select()
        .single()
      
      if (data) {
        setPlayerId(data.id)
        localStorage.setItem('swallowsPlayerId', data.id)
      }
    } catch (err) {
      console.error('Failed to join room:', err)
    }
    
    setScreen('lobby')
    localStorage.setItem('swallowsScreen', 'lobby')
    localStorage.setItem('swallowsRoomCode', code)
    localStorage.setItem('swallowsIsHost', isHost.toString())
  }

  const handleFinish = (completed = false) => {
    if (completed) {
      setHasPlayed(true)
      localStorage.setItem('swallowsHasPlayed', 'true')
    }
    setScreen('leaderboard')
    localStorage.setItem('swallowsScreen', 'leaderboard')
  }

  const handleReset = () => {
    localStorage.removeItem('swallowsHasPlayed')
    localStorage.removeItem('swallowsScreen')
    localStorage.removeItem('swallowsRoomCode')
    localStorage.removeItem('swallowsPlayerId')
    localStorage.removeItem('swallowsIsHost')
    setHasPlayed(false)
    setRoomCode(null)
    setPlayerId(null)
    setIsHost(false)
    setScreen('home')
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <HomeScreen 
            key="home"
            onStart={handleStart} 
            onOpenLeaderboard={() => setScreen('leaderboard')} 
            hasPlayed={hasPlayed}
            onReset={handleReset}
          />
        )}
        {screen === 'lobby' && (
          <Lobby
            key="lobby"
            roomCode={roomCode}
            playerId={playerId}
            isHost={isHost}
            onStart={() => setScreen('game')}
          />
        )}
        {screen === 'game' && (
          <GameScreen 
            key="game"
            playerName={playerName} 
            playerId={playerId}
            roomCode={roomCode}
            onFinish={handleFinish} 
          />
        )}
        {screen === 'leaderboard' && (
          <Leaderboard 
            key="leaderboard"
            roomCode={roomCode}
            currentPlayerId={playerId}
            onBack={() => setScreen('home')} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

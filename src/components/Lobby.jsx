import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Play, Loader2, Copy, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

function Lobby({ roomCode, playerId, isHost, onStart }) {
  const [players, setPlayers] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPlayers()

    // Subscribe to players in this room
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
        () => fetchPlayers()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` },
        (payload) => {
          if (payload.new.status === 'playing') {
            onStart()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomCode])

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', roomCode)

    if (data) setPlayers(data)
  }

  // Simulation for bots
  useEffect(() => {
    if (!isHost) return

    const botInterval = setInterval(async () => {
      const bots = players.filter(p => p.name.startsWith('🤖'))
      if (bots.length === 0) return

      for (const bot of bots) {
        const scoreAdd = Math.floor(Math.random() * 100)
        await supabase
          .from('players')
          .update({
            score: bot.score + scoreAdd,
            current_step: Math.min(4, bot.current_step + (Math.random() > 0.9 ? 1 : 0))
          })
          .eq('id', bot.id)
      }
    }, 5000)

    return () => clearInterval(botInterval)
  }, [players, isHost])

  const handleStartGame = async () => {
    if (!isHost) return
    await supabase
      .from('rooms')
      .update({ status: 'playing' })
      .eq('code', roomCode)

    onStart()
  }

  const spawnBots = async () => {
    const bots = [
      { name: '🤖 บอทส้ม', room_code: roomCode, score: 0, current_step: 1 },
      { name: '🤖 บอทฟ้า', room_code: roomCode, score: 0, current_step: 1 },
      { name: '🤖 บอทเขียว', room_code: roomCode, score: 0, current_step: 1 },
    ]
    await supabase.from('players').insert(bots)
    fetchPlayers()
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="screen-container"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
      }}
    >
      <div className="glass-panel text-center mb-4" style={{ padding: '2rem' }}>
        <h2 style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '1rem', fontWeight: '800' }}>
          — อาณาจักรแห่งตัวเลข —
        </h2>
        <div
          onClick={copyCode}
          style={{
            fontSize: 'min(5rem, 15vw)',
            fontWeight: '900',
            background: 'linear-gradient(to bottom, #FFD700, #B8860B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          {roomCode}
          <motion.div whileHover={{ scale: 1.2 }}>
            {copied ? <Check size={24} color="#4ADE80" /> : <Copy size={24} style={{ opacity: 0.3 }} />}
          </motion.div>
        </div>
        <p style={{ color: 'var(--text-dim)', marginTop: '1rem', fontSize: '1rem' }}>แชร์รหัสลับเพื่อเข้าสู่ศึก!</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '550px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#FFD700" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>ผู้เข้าร่วม ({players.length})</h3>
          </div>
          {isHost && (
            <button
              onClick={spawnBots}
              className="btn-outline"
              style={{
                fontSize: '0.75rem',
                padding: '0.5rem 1rem',
                color: '#FFD700',
                borderRadius: '2rem',
              }}
            >
              🪄 อัญเชิญบอท
            </button>
          )}
        </div>

        {/* CHARACTER SELECTION */}
        <div className="mb-4" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.8rem', color: '#FFD700', marginBottom: '1rem', fontWeight: 'bold', textAlign: 'center' }}>เลือกจอมเวทย์ประจำตัวคุณ</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['W1.png', 'W2.png', 'M1.png', 'M2.png', 'M3.png'].map(avatar => {
              const player = players.find(p => p.id === playerId)
              const isSelected = player?.avatar === avatar
              return (
                <motion.div
                  key={avatar}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={async () => {
                    try {
                      const { error } = await supabase.from('players').update({ avatar }).eq('id', playerId)
                      if (error) throw error
                      fetchPlayers()
                    } catch (err) {
                      console.error('Failed to update avatar:', err)
                    }
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundImage: `url('/assets/${avatar}')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    borderRadius: '0.75rem',
                    border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className="flex-column" style={{ gap: '0.75rem', maxHeight: '30vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundImage: `url('/assets/${p.avatar || 'W1.png'}')`, 
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'center' 
                }} />
                <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {p.name} {p.is_host && <span style={{ color: '#FFD700' }}>👑</span>}
                </span>
              </div>
              {p.is_host && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 8px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#FFD700',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                }}>
                  เจ้าสำนัก
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 w-full flex-column items-center">
        {isHost ? (
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            disabled={players.length < 1}
            className="btn-primary"
            style={{ 
              maxWidth: '350px',
              height: '60px', 
              fontSize: '1.25rem',
            }}
          >
            เริ่มเกมเลย! <Play size={24} fill="currentColor" />
          </motion.button>
        ) : (
          <div className="flex-column items-center" style={{ gap: '1rem', color: 'rgba(212, 175, 55, 0.6)' }}>
            <Loader2 className="spin" size={28} />
            <span style={{ fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem' }}>รอเจ้าสำนักเริ่มเกม...</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Lobby

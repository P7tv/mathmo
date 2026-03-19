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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px'
      }}
    >
      <div className="glass-panel" style={{ padding: '50px', maxWidth: '550px', width: '100%', textAlign: 'center', border: '2px solid rgba(212, 175, 55, 0.2)' }}>
        <h2 style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '15px', fontWeight: '800' }}>
          — อาณาจักรแห่งตัวเลข —
        </h2>
        <div
          onClick={copyCode}
          style={{
            fontSize: '5rem',
            fontWeight: '900',
            background: 'linear-gradient(to bottom, #FFD700, #B8860B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}
        >
          {roomCode}
          <motion.div whileHover={{ scale: 1.2 }}>
            {copied ? <Check size={32} color="#4ADE80" /> : <Copy size={32} style={{ opacity: 0.3 }} />}
          </motion.div>
        </div>
        <p style={{ color: 'var(--text-dim)', marginTop: '20px', fontSize: '1.1rem' }}>แชร์รหัสลับให้เหล่าจอมเวทย์เพื่อเข้าร่วมศึก!</p>
      </div>

      <div className="glass-panel" style={{ padding: '30px', maxWidth: '550px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users size={24} color="#FFD700" />
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>ผู้เข้าร่วมทดสอบ ({players.length})</h3>
          </div>
          {isHost && (
            <button
              onClick={spawnBots}
              style={{
                fontSize: '0.8rem',
                padding: '8px 16px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '25px',
                color: '#FFD700',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(212, 175, 55, 0.2)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(212, 175, 55, 0.1)'}
            >
              🪄 อัญเชิญบอท
            </button>
          )}
        </div>

        {/* CHARACTER SELECTION */}
        <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '0.9rem', color: '#FFD700', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>เลือกจอมเวทย์ประจำตัวคุณ</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    width: '70px',
                    height: '70px',
                    backgroundImage: `url('/assets/${avatar}')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    borderRadius: '15px',
                    border: isSelected ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                    boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{
                padding: '15px 25px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundImage: `url('/assets/${p.avatar || 'W1.png'}')`, 
                  backgroundSize: 'contain', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'center' 
                }} />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  {p.name} {p.is_host && <span style={{ color: '#FFD700' }}>👑</span>}
                </span>
              </div>
              {p.is_host && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#FFD700',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  เจ้าสำนัก
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
        {isHost ? (
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            disabled={players.length < 1}
            style={{ 
              width: '100%',
              maxWidth: '350px',
              height: '70px', 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))',
              border: '2px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '25px',
              color: '#FFD700',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              cursor: players.length < 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              opacity: players.length < 1 ? 0.5 : 1,
              boxShadow: '0 15px 35px rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            ร่ายมนตร์เริ่มเกม! <Play size={26} fill="currentColor" />
          </motion.button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', color: 'rgba(212, 175, 55, 0.6)' }}>
            <Loader2 className="spin" size={32} />
            <span style={{ fontWeight: '600', letterSpacing: '1px' }}>รอเจ้าสำนักเปิดตำรา...</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Lobby

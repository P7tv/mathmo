import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Medal, Clock, Target } from 'lucide-react'
import { supabase } from '../lib/supabase'

function Leaderboard({ onBack, roomCode, currentPlayerId }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetchPlayers()

    // Real-time subscription
    const channel = supabase
      .channel('public:players')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => fetchPlayers()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomCode]) // Re-fetch if roomCode changes

  const fetchPlayers = async () => {
    let query = supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false })
      .limit(20)
    
    if (roomCode) {
      query = query.eq('room_code', roomCode)
    }
    
    const { data, error } = await query
    if (error) {
      console.error('Error fetching leaderboard:', error)
    }
    if (data) setPlayers(data)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="screen-container"
      style={{
        backgroundImage: 'url(/assets/bg3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '600px', width: '95%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
            <motion.button 
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              className="btn-icon" 
              onClick={onBack} 
              style={{ width: '36px', height: '36px' }}
            >
              <ArrowLeft size={18} />
            </motion.button>
            <div>
              <h1 style={{ fontSize: 'min(1.5rem, 6vw)', letterSpacing: '-0.5px' }}>ตารางอันดับสด</h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>คะแนน Real-time จากเหล่าผู้พิทักษ์</p>
            </div>
          </div>

          <div className="flex-column" style={{ gap: '0.5rem', maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {players.length > 0 ? players.map((player, index) => (
              <motion.div 
                key={player.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${player.id === currentPlayerId ? 'current-player' : ''}`} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem 1rem',
                  background: player.id === currentPlayerId ? 'rgba(45, 100, 255, 0.15)' : (index === 0 ? 'rgba(255, 204, 0, 0.1)' : 'rgba(255,255,255,0.03)'),
                  border: player.id === currentPlayerId ? '2px solid #3B82F6' : (index === 0 ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)'),
                  borderRadius: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'var(--accent)' : (player.id === currentPlayerId ? '#3B82F6' : 'rgba(255,255,255,0.1)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.7rem',
                    color: (index === 0 || player.id === currentPlayerId) ? '#000' : 'white'
                  }}>
                    {index === 0 ? <Trophy size={14} /> : index + 1}
                  </div>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundImage: `url('/assets/${player.avatar || 'W1.png'}')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>
                       {player.is_shielded ? '🛡️ มีโล่ป้องกัน' : `ข้อที่ ${player.current_step}`}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--accent)' }}>
                    {player.score.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                <Medal size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p style={{ fontSize: '0.8rem' }}>ยังไม่มีผู้เล่นออนไลน์</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Leaderboard

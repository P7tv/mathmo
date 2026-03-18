import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Medal, Clock, Target } from 'lucide-react'
import { supabase } from '../lib/supabase'

function Leaderboard({ onBack }) {
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
  }, [])

  const fetchPlayers = async () => {
    let query = supabase
      .from('players')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)
    
    if (roomCode) {
      query = query.eq('room_code', roomCode)
    }
    
    const { data } = await query
    if (data) setPlayers(data)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="screen-container"
      style={{
        backgroundImage: 'url(/assets/backgrounds/3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '20px' }}>
            <motion.button 
              whileHover={{ scale: 1.1, x: -5 }}
              className="btn-icon" 
              onClick={onBack} 
              style={{ width: '48px', height: '48px' }}
            >
              <ArrowLeft size={24} />
            </motion.button>
            <div>
              <h1 style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>ตารางอันดับสด</h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>คะแนน Real-time จากผู้เล่นทุกคน</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {players.length > 0 ? players.map((player, index) => (
              <motion.div 
                key={player.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '20px 24px',
                  background: index === 0 ? 'rgba(255, 204, 0, 0.15)' : 'var(--glass-surface)',
                  border: index === 0 ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                  transform: index === 0 ? 'scale(1.02)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'var(--accent)' : 'var(--glass-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    color: index === 0 ? '#000' : 'white'
                  }}>
                    {index === 0 ? <Trophy size={20} /> : index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{player.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                       {player.is_shielded ? '🛡️ มีโล่ป้องกัน' : `ข้อที่ ${player.current_step}`}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent)' }}>
                    {player.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{player.total_time || 0} วินาที</div>
                </div>
              </motion.div>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>
                <Medal size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                <p>ยังไม่มีผู้เล่นออนไลน์ในขณะนี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Leaderboard

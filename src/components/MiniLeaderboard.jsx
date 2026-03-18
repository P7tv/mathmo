import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Target, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'

function MiniLeaderboard({ roomCode, currentPlayerId }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetchPlayers()

    const channel = supabase
      .channel(`mini-lb:${roomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_code=eq.${roomCode}` },
        () => fetchPlayers()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomCode])

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', roomCode)
      .order('score', { ascending: false })
      .limit(5)
    
    if (data) setPlayers(data)
  }

  return (
    <div 
      className="glass-panel" 
      style={{ 
        width: '240px', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <Trophy size={16} /> <span>อันดับตอนนี้</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => (
            <motion.div 
              key={player.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '10px',
                background: player.id === currentPlayerId ? 'rgba(251,191,36,0.1)' : 'transparent',
                border: player.id === currentPlayerId ? '1px solid rgba(251,191,36,0.2)' : '1px solid transparent'
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '900', color: index === 0 ? 'var(--accent)' : 'var(--text-dim)', width: '15px' }}>
                {index + 1}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {player.name} {player.is_shielded && '🛡️'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', gap: '5px' }}>
                  <span>{player.score.toLocaleString()}</span>
                  <span>•</span>
                  <span>{player.current_step === 5 ? '🏁' : `ข้อ ${player.current_step}`}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ fontSize: '0.65rem', textAlign: 'center', opacity: 0.3, marginTop: '5px' }}>
        รหัสห้อง: {roomCode}
      </div>
    </div>
  )
}

export default MiniLeaderboard

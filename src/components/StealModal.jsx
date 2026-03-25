import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Target } from 'lucide-react'
import { supabase } from '../lib/supabase'

function StealModal({ stealerId, roomCode, onSteal }) {
  const [opponents, setOpponents] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchOpponents = async () => {
      let query = supabase
        .from('players')
        .select('*')
        .neq('id', stealerId)
        .order('score', { ascending: false })
        .limit(5)
      
      if (roomCode) {
        query = query.eq('room_code', roomCode)
      }

      const { data } = await query
      if (data) setOpponents(data)
    }
    fetchOpponents()
  }, [stealerId, roomCode])

  const handleSteal = () => {
    if (!selectedId) return
    setIsAnimating(true)
    const target = opponents.find(o => o.id === selectedId)
    const stolenAmount = Math.floor(target.score * 0.2)
    
    setTimeout(() => {
      onSteal({ target, amount: stolenAmount })
    }, 2000)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel"
      style={{
        padding: '1.5rem',
        maxWidth: '500px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        background: 'rgba(0,0,0,0.92)',
        zIndex: 1100,
        boxShadow: '0 0 50px rgba(249,115,22,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="flex-column items-center" style={{ gap: '0.25rem' }}>
         <Target size={32} color="#F97316" className="pulse-slow" />
         <h2 style={{ fontSize: 'min(1.5rem, 6vw)' }}>🗡️ เลือกเป้าหมาย!</h2>
         <p style={{ color: 'var(--text-dim)', textAlign: 'center', fontSize: '0.8rem' }}>ขโมย 20% ของแต้มเป้าหมาย</p>
      </div>

      <div className="flex-column w-full" style={{ gap: '0.75rem', maxHeight: '40vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {opponents.length > 0 ? opponents.map(opponent => (
          <motion.div
            key={opponent.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedId(opponent.id)}
            style={{
              padding: '1rem',
              borderRadius: '1rem',
              border: `2px solid ${selectedId === opponent.id ? '#F97316' : 'rgba(255,255,255,0.05)'}`,
              background: selectedId === opponent.id ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'var(--glass-bg)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#F97316',
              fontSize: '0.8rem'
            }}>
              {opponent.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{opponent.name} {opponent.is_shielded && '🛡️'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{opponent.score.toLocaleString()} แต้ม</div>
            </div>
            {selectedId === opponent.id && <motion.div layoutId="check" style={{ color: '#F97316' }}>🗡️</motion.div>}
          </motion.div>
        )) : (
          <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.5, fontSize: '0.9rem' }}>ยังไม่มีคู่แข่งในห้องนี้</div>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleSteal}
        disabled={!selectedId || isAnimating}
        style={{ 
          width: '100%', 
          height: '54px', 
          fontSize: '1rem',
          background: selectedId ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'rgba(255,255,255,0.1)'
        }}
      >
        {isAnimating ? 'กำลังลงมือขโมย... 🗡️' : 'ขโมยเลย!'}
      </button>

      {isAnimating && (
        <motion.div
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(249,115,22,0.15)', pointerEvents: 'none' }}
        />
      )}
    </motion.div>
  )
}

export default StealModal

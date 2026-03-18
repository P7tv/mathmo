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
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        background: 'rgba(0,0,0,0.92)',
        zIndex: 1100,
        boxShadow: '0 0 50px rgba(249,115,22,0.3)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
         <Target size={48} color="#F97316" className="pulse-slow" />
         <h2 style={{ fontSize: '1.8rem' }}>🗡️ เลือกเป้าหมาย!</h2>
         <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>ขโมย 20% ของแต้มเป้าหมายในห้องนี้</p>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {opponents.length > 0 ? opponents.map(opponent => (
          <motion.div
            key={opponent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedId(opponent.id)}
            style={{
              padding: '15px 20px',
              borderRadius: '16px',
              border: `2px solid ${selectedId === opponent.id ? '#F97316' : 'rgba(255,255,255,0.1)'}`,
              background: selectedId === opponent.id ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'var(--glass-bg)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--accent)'
            }}>
              {opponent.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{opponent.name} {opponent.is_shielded && '🛡️'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{opponent.score.toLocaleString()} แต้ม</div>
            </div>
            {selectedId === opponent.id && <motion.div layoutId="check" style={{ color: '#F97316' }}>🗡️</motion.div>}
          </motion.div>
        )) : (
          <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5 }}>ยังไม่มีคู่แข่งในห้องนี้</div>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleSteal}
        disabled={!selectedId || isAnimating}
        style={{ 
          width: '100%', 
          height: '60px', 
          fontSize: '1.1rem',
          background: selectedId ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'rgba(255,255,255,0.1)'
        }}
      >
        {isAnimating ? 'กำลังลงมือขโมย... 🗡️' : 'ขโมยเลย!'}
      </button>

      {isAnimating && (
        <motion.div
          animate={{ x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(249,115,22,0.2)', pointerEvents: 'none', borderRadius: '24px' }}
        />
      )}
    </motion.div>
  )
}

export default StealModal

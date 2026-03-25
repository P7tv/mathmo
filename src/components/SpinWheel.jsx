import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Skull, Target, Shield, Zap, TrendingUp, MinusCircle } from 'lucide-react'

const SEGMENTS = [
  { label: '+100', value: 100, color: '#4ADE80', icon: <TrendingUp size={20} /> },
  { label: '+50', value: 50, color: '#22C55E', icon: <Zap size={20} /> },
  { label: '-50', value: -50, color: '#EF4444', icon: <MinusCircle size={20} /> },
  { label: '-100', value: -100, color: '#B91C1C', icon: <Skull size={20} /> },
  { label: 'x2', value: 'x2', color: '#FBBF24', icon: <Trophy size={20} /> },
  { label: 'Reset', value: 'reset', color: '#8B5CF6', icon: <Zap size={20} /> },
  { label: 'Steal', value: 'steal', color: '#F97316', icon: <Target size={20} /> },
  { label: 'Shield', value: 'shield', color: '#3B82F6', icon: <Shield size={20} /> },
]

function SpinWheel({ onResult }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [finalResult, setFinalResult] = useState(null)
  
  const spin = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const extraRounds = 5 + Math.random() * 5
    const randomAngle = Math.floor(Math.random() * 360)
    const newRotation = rotation + (extraRounds * 360) + randomAngle
    
    setRotation(newRotation)
    
    setTimeout(() => {
      setIsSpinning(false)
      const actualAngle = (360 - (newRotation % 360)) % 360
      const segmentSize = 360 / SEGMENTS.length
      const index = Math.floor(actualAngle / segmentSize)
      const result = SEGMENTS[index]
      setFinalResult(result)
      
      setTimeout(() => {
        onResult(result)
      }, 1500)
    }, 4000) // 4s spin
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="glass-panel text-center"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid var(--accent)',
        boxShadow: '0 0 50px rgba(255,215,0,0.2)',
        maxWidth: '450px'
      }}
    >
      <h2 style={{ fontSize: 'min(1.8rem, 6vw)' }}>🎡 วงล้อลุ้นโชค!</h2>
      
      <div style={{ position: 'relative', width: 'min(300px, 70vw)', height: 'min(300px, 70vw)' }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '32px',
          background: 'var(--accent)',
          clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
          zIndex: 20,
        }} />
        
        {/* Wheel Container */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.12, 0, 0.39, 0] }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '8px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            position: 'relative',
            background: '#111'
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const angle = 360 / SEGMENTS.length
            return (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  width: '50%',
                  height: '50%',
                  background: seg.color,
                  transformOrigin: '100% 100%',
                  transform: `rotate(${i * angle}deg) skewY(${angle - 90}deg)`,
                  opacity: 0.8,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            )
          })}
          
          {/* Labels */}
          {SEGMENTS.map((seg, i) => {
             const angle = 360 / SEGMENTS.length
             return (
               <div 
                 key={`label-${i}`}
                 style={{
                   position: 'absolute',
                   width: '100%',
                   height: '100%',
                   display: 'flex',
                   justifyContent: 'center',
                   top: '10px',
                   transform: `rotate(${i * angle + angle / 2}deg)`,
                   fontWeight: 'bold',
                   fontSize: '0.75rem',
                   color: 'white',
                   textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                 }}
               >
                 <div style={{ textAlign: 'center' }}>
                    {seg.label}
                 </div>
               </div>
             )
          })}
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '15%',
            height: '15%',
            background: 'white',
            borderRadius: '50%',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
          }}>
            <Zap size="60%" fill="currentColor" />
          </div>
        </motion.div>
      </div>
      
      <button 
        className="btn-primary" 
        onClick={spin}
        disabled={isSpinning || finalResult}
        style={{ maxWidth: '200px' }}
      >
        {isSpinning ? 'กำลังหมุน...' : finalResult ? 'ยินดีด้วย!' : 'กดเพื่อหมุน!'}
      </button>
      
      <AnimatePresence>
        {finalResult && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: finalResult.color 
            }}
          >
             {finalResult.label === 'Steal' ? '🗡️ เตรียมตัวขโมยแต้ม!' : `✨ คุณได้รับ ${finalResult.label}!`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SpinWheel

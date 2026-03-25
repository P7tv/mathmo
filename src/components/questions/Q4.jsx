import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, CheckCircle2, Circle } from 'lucide-react'

function Q4({ onResult }) {
  const [windowWidth, setWindowWidth] = useState(window?.innerWidth || 1000)
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const choices = ['5', '6', '7-8', '9', '10']
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('voting') // 'voting', 'polling', 'reveal'
  const [pollData, setPollData] = useState([])

  const handleSelect = (choice) => {
    setSelected(choice)
    setPhase('polling')
    
    setTimeout(() => {
      const simulatedData = choices.map(c => ({
        choice: c,
        percentage: c === '7-8' ? 58 : Math.floor(Math.random() * 15) + 5
      }))
      setPollData(simulatedData)
      setPhase('reveal')
      
      setTimeout(() => {
        onResult(choice === '7-8')
      }, 3000)
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ 
        padding: isMobile ? '15px' : '40px', 
        maxWidth: '850px', 
        width: '95%', 
        position: 'relative',
        margin: '0 auto',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '30px' }}>
        {/* Question Header & Description */}
        <div style={{ 
          textAlign: 'center', 
          padding: isMobile ? '15px' : '25px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.3)'
        }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.2)', padding: isMobile ? '4px 12px' : '10px 25px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.4)', marginBottom: '15px' }}>
              <Users size={isMobile ? 16 : 24} color="#FFD700" />
              <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>ภารกิจสุดท้าย: บทสรุป</span>
           </div>
           <h2 style={{ fontSize: isMobile ? '1.25rem' : '2.2rem', color: '#fff', marginBottom: '12px', lineHeight: 1.1, fontWeight: '900', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
             สุ่มทั้ง <span style={{ color: '#FFD700' }}>ฝั่ง</span> และ <span style={{ color: '#FFD700' }}>ตำแหน่ง</span>
           </h2>
           <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '0.95rem' : '1.3rem', fontWeight: '600' }}>
             คิดว่านักเรียนจะสามารถสุ่มนั่งได้ <br/> <span style={{ color: '#FFD700', fontSize: isMobile ? '1.4rem' : '1.8rem' }}>มากที่สุดกี่คน?</span>
           </p>
        </div>
        
        {/* Choices Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '12px' }}>
          {choices.map((choice, i) => {
            const isSelected = selected === choice
            const data = pollData.find(d => d.choice === choice)
            
            return (
              <motion.button 
                key={i}
                disabled={phase !== 'voting'}
                onClick={() => handleSelect(choice)}
                whileHover={phase === 'voting' ? { scale: 1.01, x: 5 } : {}}
                whileTap={phase === 'voting' ? { scale: 0.99 } : {}}
                style={{ 
                  position: 'relative',
                  width: '100%',
                  padding: isMobile ? '12px 15px' : '20px 25px',
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                  cursor: phase === 'voting' ? 'pointer' : 'default',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  transition: 'all 0.3s'
                }}
              >
                {phase === 'reveal' && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data?.percentage}%` }}
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      bottom: 0, 
                      background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.05)',
                      zIndex: 0
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '15px', position: 'relative', zIndex: 1 }}>
                  {isSelected ? <CheckCircle2 size={isMobile ? 18 : 24} color="#FFD700" /> : <Circle size={isMobile ? 16 : 22} color="rgba(255,255,255,0.2)" />}
                  <span style={{ fontSize: isMobile ? '0.9rem' : '1.3rem', fontWeight: '800', color: isSelected ? '#FFD700' : '#fff' }}>{choice} คน</span>
                </div>

                {phase === 'reveal' && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={{ fontSize: isMobile ? '0.9rem' : '1.2rem', fontWeight: '900', position: 'relative', zIndex: 1, color: isSelected ? '#FFD700' : 'rgba(255,255,255,0.5)' }}
                  >
                    {data?.percentage}%
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default Q4

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, CheckCircle2, Circle } from 'lucide-react'

function Q4({ onResult }) {
  const choices = ['5', '6', '7-8', '9', '10']
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('voting') // 'voting', 'polling', 'reveal'
  const [pollData, setPollData] = useState([])

  const handleSelect = (choice) => {
    setSelected(choice)
    setPhase('polling')
    
    // Simulate real-time polling
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
      style={{ padding: '60px', maxWidth: '650px', width: '100%', textAlign: 'center', position: 'relative' }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
           <div style={{ padding: '15px', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
             <Users size={32} color="var(--primary)" />
           </div>
           <div>
             <h2 style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>ผลสำรวจความจุรวม</h2>
             <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '10px' }}>
               {phase === 'voting' ? 'คุณคิดว่าคนส่วนใหญ่จะตอบข้อไหน?' : 'คนในห้องกำลังเลือกคำตอบนี้...'}
             </p>
           </div>
        </div>
        
        <p style={{ marginBottom: '40px', fontSize: '1.4rem', fontWeight: 'bold' }}>
          รถไฟขบวนนี้รับคนได้ทั้งหมดกี่คน?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {choices.map((choice, i) => {
            const isSelected = selected === choice
            const data = pollData.find(d => d.choice === choice)
            
            return (
              <motion.button 
                key={i}
                disabled={phase !== 'voting'}
                onClick={() => handleSelect(choice)}
                className="glass-panel"
                whileHover={phase === 'voting' ? { scale: 1.02, x: 5 } : {}}
                whileTap={phase === 'voting' ? { scale: 0.98 } : {}}
                style={{ 
                  position: 'relative',
                  width: '100%',
                  padding: '25px',
                  background: isSelected ? 'rgba(255,165,0,0.1)' : 'var(--glass-surface)',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--glass-border)',
                  cursor: phase === 'voting' ? 'pointer' : 'default',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                {/* Poll Bar Backdrop */}
                {phase === 'reveal' && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data?.percentage}%` }}
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      bottom: 0, 
                      background: isSelected ? 'rgba(255,165,0,0.15)' : 'rgba(255,255,255,0.05)',
                      zIndex: 0
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1 }}>
                  {isSelected ? <CheckCircle2 size={24} color="var(--accent)" /> : <Circle size={24} color="var(--text-dim)" />}
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{choice} คน</span>
                </div>

                {phase === 'reveal' && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '1.2rem', fontWeight: '800', position: 'relative', zIndex: 1, color: isSelected ? 'var(--accent)' : 'var(--text-dim)' }}
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

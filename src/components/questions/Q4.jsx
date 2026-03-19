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
      style={{ padding: '60px', maxWidth: '650px', width: '100%', textAlign: 'center', position: 'relative', border: '2px solid rgba(212, 175, 55, 0.2)' }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
           <img 
             src="/assets/Question 4.png" 
             alt="Question 4 Detail" 
             style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
           />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
           <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
             <Users size={32} color="#FFD700" />
           </div>
           <div>
             <h2 style={{ fontSize: '1.8rem', color: '#FFD700', lineHeight: 1.4 }}>นักเรียนทุกคนจะนั่งแบบสุ่มโดยสุ่มทั้ง ฝั่งและตำแหน่ง</h2>
             <p style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '1.1rem', marginTop: '10px' }}>
               คิดว่านักเรียนจะสามารถนั่งได้มากที่สุดกี่คน?
             </p>
           </div>
        </div>
        
        <p style={{ marginBottom: '40px', fontSize: '1.4rem', fontWeight: 'bold', color: '#fff' }}>
          มตินี้สำคัญยิ่ง... รถไฟสายอาคมนี้จะรับคนได้ทั้งหมดกี่คน?
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
                whileHover={phase === 'voting' ? { scale: 1.02, x: 5, background: 'rgba(212, 175, 55, 0.1)' } : {}}
                whileTap={phase === 'voting' ? { scale: 0.98 } : {}}
                style={{ 
                  position: 'relative',
                  width: '100%',
                  padding: '25px',
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.3)',
                  border: isSelected ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                  cursor: phase === 'voting' ? 'pointer' : 'default',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                  borderRadius: '20px'
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
                      background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                      zIndex: 0
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1 }}>
                  {isSelected ? <CheckCircle2 size={24} color="#FFD700" /> : <Circle size={24} color="rgba(212, 175, 55, 0.3)" />}
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: isSelected ? '#FFD700' : '#fff' }}>{choice} คน</span>
                </div>

                {phase === 'reveal' && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '1.2rem', fontWeight: '800', position: 'relative', zIndex: 1, color: isSelected ? '#FFD700' : 'rgba(212, 175, 55, 0.6)' }}
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

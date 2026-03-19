import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Info, Lock } from 'lucide-react'

function Q3({ onResult, playerAvatar }) {
  const [userSelections, setUserSelections] = useState([]) // Array of {comp, x} items
  const [phase, setPhase] = useState('placing')
  const [systemBirds, setSystemBirds] = useState([])

  const handleCellClick = (comp, x) => {
    if (phase !== 'placing') return
    const exists = userSelections.find(s => s.comp === comp && s.x === x)
    if (exists) {
      setUserSelections(userSelections.filter(s => !(s.comp === comp && s.x === x)))
    } else if (userSelections.length < 4) {
      const tooClose = userSelections.some(s => s.comp === comp && Math.abs(s.x - x) < 1)
      if (!tooClose) {
        setUserSelections([...userSelections, { comp, x }])
      }
    }
  }

  const handleConfirm = () => {
    if (userSelections.length < 4) return
    setPhase('calculating')

    setTimeout(() => {
      const newSystem = []
      const all = [...userSelections]
      for (let c = 0; c < 2; c++) {
        for (let x = 0; x <= 5; x++) {
          if (all.some(s => s.comp === c && s.x === x)) continue
          if (!all.some(s => s.comp === c && Math.abs(s.x - x) < 1)) {
            newSystem.push({ comp: c, x })
            all.push({ comp: c, x })
          }
        }
      }
      setSystemBirds(newSystem)
      setPhase('result')

      const comp0 = userSelections.filter(s => s.comp === 0).map(s => s.x).sort()
      const comp1 = userSelections.filter(s => s.comp === 1).map(s => s.x).sort()
      
      const isCorrect = 
        comp0.length === 2 && comp0[0] === 0 && comp0[1] === 2 &&
        comp1.length === 2 && comp1[0] === 0 && comp1[1] === 2

      setTimeout(() => {
        onResult(isCorrect)
      }, 2000)
    }, 1500)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '40px', maxWidth: '750px', width: '100%', position: 'relative', border: '2px solid rgba(212, 175, 55, 0.2)' }}
    >
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
         <img 
           src="/assets/Question 3.png" 
           alt="Question 3 Detail" 
           style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
         />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <Target size={28} color="#FFD700" />
         <div>
           <h2 style={{ fontSize: '1.6rem', color: '#FFD700', lineHeight: 1.4 }}>สามารถเลือกที่นั่งให้ 4 คนแรก ได้แต่หลังจากนั้นนักเรียนจะนั่งแบบสุ่มในฝั่งใดฝั่งหนึ่ง</h2>
           <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>จัดวางนักเรียนให้สามารถนั่งได้มากที่สุด</p>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '40px' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative' }}>
             <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: '#FFD700', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
               สายอาคมที่ {comp + 1}
             </div>
             <div style={{ display: 'flex', gap: '8px', height: '80px' }}>
               {[0, 1, 2, 3, 4, 5].map(x => {
                 const isUser = userSelections.some(s => s.comp === comp && s.x === x)
                 const isSystem = systemBirds.some(s => s.comp === comp && s.x === x)
                 return (
                   <motion.div 
                     key={x}
                     onClick={() => handleCellClick(comp, x)}
                     whileHover={phase === 'placing' ? { background: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.4)' } : {}}
                     style={{ 
                       flex: 1, 
                       border: '1px solid rgba(255,255,255,0.1)', 
                       borderRadius: '16px',
                       cursor: phase === 'placing' ? 'pointer' : 'default',
                       background: isUser ? 'rgba(212, 175, 55, 0.2)' : isSystem ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'relative',
                       borderWidth: isUser ? '2px' : '1px',
                       borderColor: isUser ? '#FFD700' : 'rgba(255,255,255,0.1)'
                     }}
                   >
                     <span style={{ position: 'absolute', bottom: -18, fontSize: '0.7rem', opacity: 0.4 }}>{x}ม.</span>
                      {(isUser || isSystem) && (
                        <motion.div 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          style={{ 
                             width: '80%',
                             height: '80%',
                             backgroundImage: `url(/assets/${isUser ? (playerAvatar || 'W1.png') : 'Boky.png'})`,
                             backgroundSize: 'contain',
                             backgroundRepeat: 'no-repeat',
                             backgroundPosition: 'center',
                             filter: isSystem ? 'grayscale(0.8) opacity(0.4)' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
                             zIndex: 10
                          }} 
                        />
                      )}
                   </motion.div>
                 )
               })}
             </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '20px' }}>
        <div style={{ fontSize: '1.1rem', color: '#fff' }}>
          อัญเชิญแล้ว: <strong style={{ color: '#FFD700', fontSize: '1.8rem' }}>{userSelections.length} / 4</strong>
        </div>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm} 
            disabled={!isButtonActive}
            style={{ 
              height: '80px', 
              padding: '0 60px', 
              fontSize: '1.5rem',
              background: isButtonActive ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))' : 'rgba(255,255,255,0.05)',
              border: isButtonActive ? '2px solid rgba(212, 175, 55, 0.6)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '25px',
              color: isButtonActive ? '#FFD700' : 'rgba(255,255,255,0.2)',
              fontWeight: 'bold',
              cursor: isButtonActive ? 'pointer' : 'not-allowed',
              boxShadow: isButtonActive ? '0 15px 35px rgba(212, 175, 55, 0.2)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
          >
             {phase === 'placing' ? 'ร่ายมนตร์ยืนยัน' : phase === 'calculating' ? 'กำลังสุ่มวางเพิ่ม...' : 'รอดูผลลัพธ์'}
          </motion.button>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.9rem', justifyContent: 'center' }}>
        <Info size={18} /> เคล็ดลับ: ต้องเลือกตำแหน่ง [0 และ 2] ของแต่ละสายเพื่อให้วางได้มากที่สุด!
      </div>
    </motion.div>
  )
}

export default Q3

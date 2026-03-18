import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Info, Lock } from 'lucide-react'

function Q3({ onResult }) {
  // Use a simple selection instead of sliders if it helps clarity, or keep sliders and check [0, 2]
  // Let's use selection for Q3 to make it distinct and match "เลือกที่นั่ง" (Select seats)
  const [userSelections, setUserSelections] = useState([]) // Array of {comp, x} items
  const [phase, setPhase] = useState('placing')
  const [systemBirds, setSystemBirds] = useState([])

  const handleCellClick = (comp, x) => {
    if (phase !== 'placing') return
    const exists = userSelections.find(s => s.comp === comp && s.x === x)
    if (exists) {
      setUserSelections(userSelections.filter(s => !(s.comp === comp && s.x === x)))
    } else if (userSelections.length < 4) {
      // Basic rule for user: >= 1m apart
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
      // Simulate system filling the rest
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

      // Logic: Correct ONLY if user selections are [0, 2] for both compartments
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
      style={{ padding: '40px', maxWidth: '750px', width: '100%', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <div style={{ padding: '10px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
           <Target size={24} color="var(--accent)" />
         </div>
         <div>
           <h2 style={{ fontSize: '1.8rem' }}>เลือกที่นั่งให้ 4 คนแรก (Q3)</h2>
           <p style={{ color: 'var(--text-dim)' }}>สุ่มวางคนในจุดที่เหลือ โดยทุกคนต้องห่างกัน {">= 1 เมตร"}</p>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '40px' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative' }}>
             <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>ตู้ที่ {comp + 1}</div>
             <div style={{ display: 'flex', gap: '6px', height: '60px' }}>
               {[0, 1, 2, 3, 4, 5].map(x => {
                 const isUser = userSelections.some(s => s.comp === comp && s.x === x)
                 const isSystem = systemBirds.some(s => s.comp === comp && s.x === x)
                 return (
                   <motion.div 
                     key={x}
                     onClick={() => handleCellClick(comp, x)}
                     whileHover={phase === 'placing' ? { backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                     style={{ 
                       flex: 1, 
                       border: '1px solid var(--glass-border)', 
                       borderRadius: '12px',
                       cursor: phase === 'placing' ? 'pointer' : 'default',
                       background: isUser ? 'var(--accent)' : isSystem ? 'rgba(255,255,255,0.15)' : 'var(--glass-surface)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       position: 'relative'
                     }}
                   >
                     <span style={{ position: 'absolute', bottom: -18, fontSize: '0.65rem', opacity: 0.5 }}>{x}ม.</span>
                     {(isUser || isSystem) && (
                       <motion.div 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         style={{ 
                            fontSize: isUser ? '2rem' : '1.5rem',
                            filter: isSystem ? 'grayscale(0.5) opacity(0.7)' : 'none',
                            zIndex: 10
                         }} 
                       >
                         {isUser ? '🐦' : '🕊️'}
                       </motion.div>
                     )}
                   </motion.div>
                 )
               })}
             </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1rem' }}>
          เลือกแล้ว: <strong style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>{userSelections.length} / 4</strong>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleConfirm}
          disabled={userSelections.length < 4 || phase !== 'placing'}
          style={{ minWidth: '180px' }}
        >
          {phase === 'placing' ? 'ยืนยันตำแหน่ง' : phase === 'calculating' ? 'กำลังสุ่มวางคนเพิ่ม...' : 'รอดูผลลัพธ์'}
        </button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        <Info size={16} /> เคล็ดลับ: เลือกตำแหน่งให้สามารถวางคนได้มากที่สุดเท่าที่จะเป็นไปได้
      </div>
    </motion.div>
  )
}

export default Q3

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Info, Lock } from 'lucide-react'

function Q3({ onResult, playerAvatar }) {
  const [windowWidth, setWindowWidth] = useState(window?.innerWidth || 1000)
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [userSelections, setUserSelections] = useState([])
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

  const isButtonActive = userSelections.length === 4

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ 
        padding: isMobile ? '15px' : '30px', 
        maxWidth: '850px', 
        width: '95%', 
        position: 'relative',
        margin: '0 auto',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '15px' : '25px'
      }}
    >
      {/* Question Header & Description */}
      <div style={{ 
        textAlign: 'center', 
        padding: isMobile ? '15px' : '25px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.2)', padding: isMobile ? '4px 12px' : '8px 20px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.4)', marginBottom: '15px' }}>
          <Target size={isMobile ? 14 : 20} color="#FFD700" />
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>ภารกิจที่ 3: แผนภูมิพิทักษ์ที่นั่ง</span>
        </div>
        <h2 style={{ fontSize: isMobile ? '1.25rem' : '2rem', color: '#fff', marginBottom: '12px', lineHeight: 1.2, fontWeight: '900', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
           เลือกที่นั่งให้ <span style={{ color: '#FFD700' }}>4 คนแรก</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '0.9rem' : '1.2rem', lineHeight: 1.5, fontWeight: '500' }}>
          เพื่อให้เพื่อนคนอื่นๆ <br/> จะสุ่มนั่งได้ <span style={{ color: '#FFD700', fontWeight: 'bold' }}>มากที่สุดกี่คน?</span>
        </p>
      </div>

      {/* Interactive Tool */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '30px', padding: isMobile ? '12px' : '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative' }}>
             <div style={{ marginBottom: isMobile ? '8px' : '15px', fontSize: '0.75rem', color: '#FFD700', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FFD700' }} />
                สาย {comp + 1}
             </div>
              <div style={{ display: 'flex', gap: isMobile ? '4px' : '8px', height: isMobile ? '50px' : '75px' }}>
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
                        borderRadius: isMobile ? '8px' : '14px',
                        cursor: phase === 'placing' ? 'pointer' : 'default',
                        background: isUser ? 'rgba(212, 175, 55, 0.15)' : isSystem ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        borderWidth: isUser ? '2px' : '1px',
                        borderColor: isUser ? '#FFD700' : 'rgba(255,255,255,0.1)',
                        transition: 'all 0.3s'
                      }}
                    >
                      <span style={{ position: 'absolute', bottom: -16, fontSize: '0.55rem', opacity: 0.3 }}>{x}ม.</span>
                       {(isUser || isSystem) && (
                         <motion.div 
                           initial={{ scale: 0, y: -5 }}
                           animate={{ scale: 1, y: 0 }}
                           style={{ 
                              width: '80%',
                              height: '80%',
                               backgroundImage: `url('/assets/${isUser ? (playerAvatar || 'W1.png') : 'W1.png'}')`,
                               backgroundSize: 'contain',
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'center',
                               filter: isSystem ? 'grayscale(0.8) opacity(0.5) brightness(0.6)' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
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

      {/* Control Section */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: isMobile ? '12px' : '15px 25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', gap: isMobile ? '10px' : '0' }}>
        <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
          อัญเชิญ: <strong style={{ color: '#FFD700', fontSize: isMobile ? '1.2rem' : '1.8rem', marginLeft: '5px' }}>{userSelections.length} / 4</strong>
        </p>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm} 
            disabled={!isButtonActive || phase !== 'placing'}
            style={{ 
              height: isMobile ? '45px' : '65px', 
              padding: isMobile ? '0 20px' : '0 45px', 
              fontSize: isMobile ? '0.9rem' : '1.2rem',
              width: isMobile ? '100%' : 'auto',
              background: isButtonActive && phase === 'placing' ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))' : 'rgba(255,255,255,0.05)',
              border: isButtonActive && phase === 'placing' ? '2px solid rgba(212, 175, 55, 0.6)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: isButtonActive && phase === 'placing' ? '#FFD700' : 'rgba(255,255,255,0.2)',
              fontWeight: 'bold',
              cursor: isButtonActive && phase === 'placing' ? 'pointer' : 'not-allowed',
              boxShadow: isButtonActive && phase === 'placing' ? '0 10px 25px rgba(212, 175, 55, 0.2)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
          >
             {phase === 'placing' ? 'ยืนยัน' : phase === 'calculating' ? 'กำลังร่ายมนตร์...' : 'รอดูผล'}
          </motion.button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.85rem', justifyContent: 'center' }}>
        <Info size={16} /> 💡 เคล็ดลับ: ต้องเลือกตำแหน่ง [0 และ 2] ของแต่ละสายเพื่อให้เพื่อนที่เหลือลงได้มากที่สุด!
      </div>
    </motion.div>
  )
}

export default Q3

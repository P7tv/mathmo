import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Info } from 'lucide-react'

function Q2({ onResult, playerAvatar }) {
  const [windowWidth, setWindowWidth] = useState(window?.innerWidth || 1000)
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [placedBirds, setPlacedBirds] = useState([[], []])

  const toggleBird = (deckIdx, pos) => {
    setPlacedBirds(prev => {
      const newPlaced = [...prev]
      const currentDeck = [...newPlaced[deckIdx]]
      if (currentDeck.includes(pos)) {
        newPlaced[deckIdx] = currentDeck.filter(p => p !== pos)
      } else {
        newPlaced[deckIdx] = [...currentDeck, pos].sort((a, b) => a - b)
      }
      return newPlaced
    })
  }

  const handleSubmit = () => {
    if (answer === '9') {
      onResult(true)
    } else {
      setAttempts(a => a + 1)
      if (attempts >= 1) setShowHint(true)
      onResult(false)
    }
  }

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
        padding: isMobile ? '10px' : '20px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 175, 55, 0.15)', padding: isMobile ? '4px 12px' : '8px 20px', borderRadius: '30px', border: '1px solid rgba(212, 175, 55, 0.3)', marginBottom: '15px' }}>
          <Sparkles size={isMobile ? 14 : 20} color="#FFD700" />
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>ภารกิจที่ 2: การเติมจอมเวทย์เพิ่ม</span>
        </div>
        <h2 style={{ fontSize: isMobile ? '1.25rem' : '2rem', color: '#fff', marginBottom: '12px', lineHeight: 1.2, fontWeight: '900', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          HOGWARTS EXPRESS มีที่นั่งยาว <br/> <span style={{ color: '#FFD700' }}>5 เมตร ในแต่ละฝั่ง</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '0.9rem' : '1.2rem', lineHeight: 1.5, fontWeight: '500' }}>
          โดยนักศึกษาต้องเว้นระยะห่างอย่างน้อย <span style={{ color: '#FFD700', fontWeight: 'bold' }}>1 เมตร</span> <br/> จะจัดวางนักศึกษาที่มาเพิ่มได้ <span style={{ color: '#FFD700', fontWeight: 'bold' }}>มากที่สุดกี่คน</span>?
        </p>
      </div>

      {/* Interactive Tool */}
      <div style={{ padding: isMobile ? '12px' : '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(212, 175, 55, 0.6)', marginBottom: '15px', textAlign: 'center' }}>
          💡 คลิกเพื่อลองวาง (มีชุดเกราะสีเงินนั่งอยู่แล้ว 3 คน)
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '30px' }}>
          {[0, 1].map(deckIdx => (
            <div key={deckIdx} style={{ display: 'flex', gap: isMobile ? '4px' : '8px', justifyContent: 'center' }}>
               {Array.from({ length: 6 }).map((_, pos) => {
                 const isFixed = (deckIdx === 0 && (pos === 1 || pos === 3)) || (deckIdx === 1 && pos === 2)
                 const isOccupied = isFixed || placedBirds[deckIdx].includes(pos)
                 
                 return (
                   <div key={pos} style={{ textAlign: 'center' }}>
                      <motion.div
                        whileHover={!isFixed ? { scale: 1.05 } : {}}
                        whileTap={!isFixed ? { scale: 0.95 } : {}}
                        onClick={() => !isFixed && toggleBird(deckIdx, pos)}
                        style={{
                          width: isMobile ? 'min(42px, 14vw)' : '75px',
                          height: isMobile ? '60px' : '95px',
                          backgroundColor: isOccupied ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                          border: isOccupied ? (isFixed ? '2px solid rgba(255,255,255,0.3)' : '2px solid #FFD700') : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '4px 2px',
                          cursor: isFixed ? 'default' : 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ width: '2px', height: '4px', background: 'rgba(212, 175, 55, 0.4)', marginBottom: '2px' }} />
                        {isOccupied && (
                          <motion.div 
                            initial={!isFixed ? { scale: 0, y: -5 } : { scale: 1 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{ 
                               flex: 1,
                               width: '100%',
                               backgroundImage: isFixed ? `url('/assets/Boky.png')` : `url('/assets/${playerAvatar || 'W1.png'}')`,
                               backgroundSize: 'contain',
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'center',
                               filter: isFixed ? 'grayscale(0.5) opacity(0.8)' : 'drop-shadow(0 3px 5px rgba(0,0,0,0.3))',
                               zIndex: 10
                            }} 
                          />
                        )}
                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', marginTop: 'auto' }}>{pos}ม.</span>
                      </motion.div>
                   </div>
                 )
               })}
            </div>
          ))}
        </div>
      </div>

      {/* Answer Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>จะจัดวางมาเพิ่มได้อีกกี่คน?</p>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="number" 
            placeholder="..." 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ 
              flex: 1, 
              height: isMobile ? '45px' : '65px', 
              fontSize: isMobile ? '1.1rem' : '1.6rem', 
              textAlign: 'center', 
              fontWeight: '900',
              background: 'rgba(0,0,0,0.4)',
              border: '2px solid rgba(255,255,255,0.1)',
              color: '#FFD700',
              borderRadius: '12px',
              outline: 'none'
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} 
            style={{ 
              height: isMobile ? '45px' : '65px', 
              padding: isMobile ? '0 15px' : '0 40px', 
              fontSize: isMobile ? '0.9rem' : '1.2rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '12px',
              color: '#FFD700',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 5px 15px rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
             ทำนายผล
          </motion.button>
        </div>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.75rem', justifyContent: 'center' }}>
        <Info size={14} /> 💡 สังเกตตำแหน่งที่มีนักศึกษานั่งอยู่เดิมให้ดี!
      </div>
    </motion.div>
  )
}

export default Q2

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function Q1({ onResult, playerAvatar }) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [placedBirds, setPlacedBirds] = useState([[], []]) // Birds for deck 1 and 2

  const toggleBird = (deckIdx, pos) => {
    setPlacedBirds(prev => {
      const newDecks = [...prev]
      const currentDeck = [...newDecks[deckIdx]]
      if (currentDeck.includes(pos)) {
        newDecks[deckIdx] = currentDeck.filter(p => p !== pos)
      } else {
        newDecks[deckIdx] = [...currentDeck, pos].sort((a, b) => a - b)
      }
      return newDecks
    })
  }

  const isInvalid = (deckIdx, pos) => {
    const deck = placedBirds[deckIdx]
    return deck.some(p => p !== pos && Math.abs(p - pos) < 1)
  }

  const handleSubmit = () => {
    if (answer === '12') {
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
      style={{ padding: '40px', maxWidth: '750px', width: '100%', position: 'relative' }}
    >
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
         <img 
           src="/assets/Question 1.png" 
           alt="Question 1 Detail" 
           style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
         />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <Sparkles size={28} color="#FFD700" />
         <div>
           <h2 style={{ fontSize: '1.6rem', color: '#FFD700', lineHeight: 1.4 }}>HOGWARTS EXPRESS มีที่นั่งยาว 5 เมตร ในแต่ละฝั่ง</h2>
           <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>โดยนักเรียนแต่ละคนต้องเว้นระยะห่างอย่างน้อย 1 เมตร จะวางนักเรียนได้มากที่สุดกี่คน</p>
         </div>
      </div>

      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', marginBottom: '30px' }}>
        <p style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.6)', marginBottom: '20px', textAlign: 'center' }}>
          💡 คลิกที่ตำแหน่งบนที่นั่งเพื่อทดลองวางตัวละครกี่ตัวก็ได้
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '10px 0' }}>
          {[0, 1].map(deckIdx => (
            <div key={deckIdx} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
               {Array.from({ length: 6 }).map((_, pos) => {
                 const isOccupied = placedBirds[deckIdx].includes(pos)
                 const tooClose = isOccupied && placedBirds[deckIdx].some(p => p !== pos && Math.abs(p - pos) < 1)
                 
                 return (
                   <div key={pos} style={{ textAlign: 'center' }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleBird(deckIdx, pos)}
                        style={{
                          width: '85px',
                          height: '110px',
                          background: isOccupied ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                          border: isOccupied ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '10px 5px',
                          cursor: 'pointer',
                          position: 'relative',
                          boxShadow: isOccupied ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ width: '2px', height: '10px', background: 'rgba(255,255,255,0.2)', marginBottom: '5px' }} />
                        {isOccupied && (
                          <motion.div 
                            initial={{ scale: 0, y: -20, rotate: -10 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            style={{ 
                               width: '100%',
                               height: '100%',
                               backgroundImage: `url(/assets/${playerAvatar || 'W1.png'})`,
                               backgroundSize: 'contain',
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'center',
                               filter: tooClose ? 'drop-shadow(0 0 10px #ff3b30) brightness(0.6) sepia(1) hue-rotate(-50deg)' : 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
                               zIndex: 10
                            }} 
                          />
                        )}
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 'auto' }}>{pos}ม.</div>
                      </motion.div>
                   </div>
                 )
               })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>มีวิธีจัดวางตัวละครทั้งหมดกี่วิธี?</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="number" 
            placeholder="คำตอบ..." 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ 
              flex: 1, 
              height: '70px', 
              fontSize: '1.8rem', 
              textAlign: 'center', 
              fontWeight: '900',
              background: 'rgba(0,0,0,0.5)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              color: '#FFD700',
              borderRadius: '16px'
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} 
            style={{ 
              height: '75px', 
              padding: '0 50px', 
              fontSize: '1.3rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              borderRadius: '20px',
              color: '#FFD700',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
             ทำนายผล
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '25px', color: '#FFD700', textAlign: 'center', fontSize: '0.95rem', background: 'rgba(212, 175, 55, 0.1)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)' }}
          >
             ✨ <strong>ตำราลับ:</strong> คำนวณจำนวนวิธีในแต่ละสาย แล้วนำมาประสาน (คูณ) กัน!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Q1

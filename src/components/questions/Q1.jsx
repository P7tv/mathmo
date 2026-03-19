import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function Q1({ onResult }) {
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
    return deck.some(p => p !== pos && Math.abs(p - pos) < 1) // Rule: distance >= 1 means difference must be >= 1. 
    // Wait, user says "ห่างกัน >= 1 เมตร". If at pos 0 and 1, distance is 1. That's allowed? 
    // "ห่างกัน >= 1 เมตร" usually means if at 0, next is at 1. 
    // BUT in the previous prompt "12 = ถูก" for 5m.
    // If length is 5m (0,1,2,3,4,5), and distance >= 1m:
    // Combinations for 1 side:
    // - 1 bird: 6 ways (0,1,2,3,4,5)
    // - 2 birds: (0,1), (0,2), (0,3), (0,4), (0,5), (1,2), (1,3), (1,4), (1,5), (2,3), (2,4), (2,5), (3,4), (3,5), (4,5) -> 15 ways
    // Wait, if 12 is correct for BOTH sides (คูณกัน), maybe each side has sqrt(12)? No.
    // Maybe each side has 3 ways? 3 * 4? 2 * 6?
    // Let's re-read: "นั่งห่างกัน >= 1 เมตร" (distance >= 1m).
    // If birds are at 0 and 1, they are 1m apart.
    // If 12 is correct and it's a multiplication of both sides:
    // Side 1 ways * Side 2 ways = 12.
    // Possible: 3 * 4 or 2 * 6.
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
      style={{ padding: '40px', maxWidth: '700px', width: '100%', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Sparkles size={24} color="#FFD700" />
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#FFD700' }}>การจัดวางจอมเวทย์ (Q1)</h2>
          <p style={{ color: 'var(--text-dim)' }}>ที่นั่งยาว 5ม. (0-5) ต้องห่างกันอย่างน้อย 1ม. ทั้ง 2 ฝั่ง</p>
        </div>
      </div>

      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', marginBottom: '30px' }}>
        <p style={{ fontSize: '0.9rem', color: 'rgba(212, 175, 55, 0.6)', marginBottom: '20px', textAlign: 'center' }}>
          💡 คลิกที่ตำแหน่งบนสายไฟเพื่อทดลองวางตัวละครกี่ตัวก็ได้
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', padding: '20px 0' }}>
          {[0, 1].map(deckIdx => (
            <div key={deckIdx} style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', margin: '0 30px' }}>
               <div style={{ position: 'absolute', top: -35, left: -10, fontSize: '0.7rem', color: '#FFD700', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                 สายอาคมที่ {deckIdx + 1}
               </div>
               {[0, 1, 2, 3, 4, 5].map(pos => {
                 const isOccupied = placedBirds[deckIdx].includes(pos)
                 const tooClose = isOccupied && placedBirds[deckIdx].some(p => p !== pos && Math.abs(p - pos) < 1)
                 
                 return (
                   <div 
                     key={pos} 
                     onClick={() => toggleBird(deckIdx, pos)}
                     style={{ 
                       position: 'absolute', 
                       left: `${(pos/5)*100}%`, 
                       bottom: '-10px',
                       width: '30px',
                       height: '60px',
                       cursor: 'pointer',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       justifyContent: 'flex-start',
                       transform: 'translateX(-50%)',
                     }}
                   >
                     <div style={{ width: '2px', height: '10px', background: 'rgba(255,255,255,0.2)', marginBottom: '5px' }} />
                     {isOccupied && (
                       <motion.div 
                         initial={{ scale: 0 }} 
                         animate={{ scale: 1 }}
                         style={{ fontSize: '1.8rem', filter: tooClose ? 'drop-shadow(0 0 10px red)' : 'none' }}
                       >
                         🧙‍♂️
                       </motion.div>
                     )}
                     <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 'auto' }}>{pos}ม.</div>
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
              color: '#FFD700'
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="btn-primary" onClick={handleSubmit} style={{ height: '70px', padding: '0 40px', fontSize: '1.1rem' }}>
             ทำนายผล
          </button>
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

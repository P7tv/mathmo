import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bird, Info } from 'lucide-react'

function Q2({ onResult }) {
  const [answer, setAnswer] = useState('')
  const prePlacedBirds = [
    { comp: 0, x: 1 },
    { comp: 0, x: 3 },
    { comp: 1, x: 2 },
  ]

  const handleSubmit = () => {
    if (answer === '9') {
      onResult(true)
    } else {
      onResult(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '40px', maxWidth: '700px', width: '100%', position: 'relative', border: '2px solid rgba(212, 175, 55, 0.2)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <Bird size={28} color="#FFD700" />
         <div>
           <h2 style={{ fontSize: '1.8rem', color: '#FFD700' }}>ความจุวิเศษสูงสุด (Q2)</h2>
           <p style={{ color: 'var(--text-dim)' }}>สายที่ 1 มีจอมเวทย์นั่งแล้วที่ 1, 3ม. และสายที่ 2 ที่ป้าย 2ม.</p>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', marginBottom: '40px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative', height: '10px', margin: '0 40px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}>
            <div style={{ position: 'absolute', top: -30, left: -20, fontSize: '0.75rem', color: '#FFD700', fontWeight: 'bold' }}>สายอาคมที่ {comp + 1}</div>
            
            {[0, 1, 2, 3, 4, 5].map(tick => (
              <div 
                key={tick} 
                style={{ 
                  position: 'absolute', 
                  left: `${(tick/5)*100}%`, 
                  height: '15px', 
                  width: '2px', 
                  background: 'rgba(255,255,255,0.2)', 
                  top: -2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }} 
              >
                <span style={{ position: 'absolute', bottom: -25, fontSize: '0.65rem', opacity: 0.4 }}>{tick}ม.</span>
              </div>
            ))}
            
            {prePlacedBirds.filter(b => b.comp === comp).map((bird, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                style={{ 
                  position: 'absolute', 
                  left: `${(bird.x / 5) * 100}%`, 
                  top: '-25px', 
                  transform: 'translateX(-50%)',
                  fontSize: '2.2rem',
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))',
                  zIndex: 5
                }}
              >
                🧙‍♂️
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>
          หากต้องรักษาระยะห่าง ≥ 1ม. จะอัญเชิญจอมเวทย์เพิ่มได้รวมกี่คน?
        </p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="number" 
            placeholder="จำนวนรวม..." 
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
            ยืนยันคำทำนาย
          </button>
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.9rem', justifyContent: 'center' }}>
        <Info size={18} /> เคล็ดลับ: นับจอมเวทย์ที่มีอยู่เดิมรวมกับที่จะอัญเชิญมาใหม่ด้วยนะ!
      </div>
    </motion.div>
  )
}

export default Q2

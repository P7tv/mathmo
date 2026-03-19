import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bird, Info } from 'lucide-react'

function Q2({ onResult, playerAvatar }) {
  const [answer, setAnswer] = useState('')
  const prePlacedBirds = [
    { comp: 0, x: 1, avatar: 'M1.png' },
    { comp: 0, x: 3, avatar: 'M2.png' },
    { comp: 1, x: 2, avatar: 'W1.png' },
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
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
         <img 
           src="/assets/Question 2.png" 
           alt="Question 2 Detail" 
           style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
         />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <Bird size={28} color="#FFD700" />
         <div>
           <h2 style={{ fontSize: '1.6rem', color: '#FFD700', lineHeight: 1.4 }}>ถ้ามีนักเรียนนั่งอยู่แล้วในฝั่งที่ 1 ที่ตำแหน่ง 1,3 เมตร และฝั่งที่ 2 ที่ตำแหน่ง 2 เมตร</h2>
           <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>จะเติมเพิ่มได้อีกกี่คน (ตอบเป็นจำนวนรวมทั้งหมด)</p>
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
                  top: '-45px', 
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  backgroundImage: `url(/assets/${bird.avatar})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.4))',
                  zIndex: 5
                }}
              />
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
             คัดแยกตัวละคร
          </motion.button>
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(212, 175, 55, 0.6)', fontSize: '0.9rem', justifyContent: 'center' }}>
        <Info size={18} /> เคล็ดลับ: นับจอมเวทย์ที่มีอยู่เดิมรวมกับที่จะอัญเชิญมาใหม่ด้วยนะ!
      </div>
    </motion.div>
  )
}

export default Q2

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
      style={{ padding: '40px', maxWidth: '700px', width: '100%', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
         <div style={{ padding: '10px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
           <Bird size={24} color="var(--accent)" />
         </div>
         <div>
           <h2 style={{ fontSize: '1.8rem' }}>ความจุสูงสุดที่คาดหวัง (Q2)</h2>
           <p style={{ color: 'var(--text-dim)' }}>ฝั่งที่ 1 นั่งแล้วที่ป้าย 1, 3ม. และฝั่งที่ 2 ที่ป้าย 2ม.</p>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '40px' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative', height: '60px', margin: '0 40px' }}>
            <div style={{ position: 'absolute', top: -25, left: -20, fontSize: '0.8rem', color: 'var(--text-dim)' }}>ตู้ที่ {comp + 1}</div>
            <div style={{ height: '4px', background: 'var(--glass-border)', position: 'absolute', top: '50%', left: 0, right: 0 }}>
              {[0, 1, 2, 3, 4, 5].map(tick => (
                <div key={tick} style={{ position: 'absolute', left: `${(tick/5)*100}%`, height: '10px', width: '2px', background: 'rgba(255,255,255,0.1)', top: -3 }} />
              ))}
              
              {prePlacedBirds.filter(b => b.comp === comp).map((bird, i) => (
                <div 
                  key={i}
                  style={{ 
                    position: 'absolute', 
                    left: `${(bird.x / 5) * 100}%`, 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '32px', 
                    height: '32px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '50%',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    fontSize: '1.4rem'
                  }}
                >
                  {['🐦', '🐧', '🦉'][i % 3]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>ความจุสูงสุดที่คาดหวังเมื่อทุกคนต้องห่างกัน {">= 1ม."} คือเท่าไร?</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="number" 
            placeholder="กรอกจำนวนคน..." 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ flex: 1, height: '65px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 'bold' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="btn-primary" onClick={handleSubmit} style={{ height: '65px', padding: '0 40px' }}>
            ยืนยัน
          </button>
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.85rem', justifyContent: 'center' }}>
        <Info size={16} /> เคล็ดลับ: คำนึงถึงระยะห่างอย่างน้อย 1 เมตร ระหว่างแต่ละคนนะ
      </div>
    </motion.div>
  )
}

export default Q2

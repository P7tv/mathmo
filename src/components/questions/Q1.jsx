import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function Q1({ onResult }) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)

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
        <Sparkles size={24} color="var(--accent)" />
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>การจัดวางตัวละคร (Q1)</h2>
          <p style={{ color: 'var(--text-dim)' }}>ที่นั่งยาว 5ม. ต้องนั่งห่างกัน {">= 1ม."} เริ่มที่ตำแหน่ง 0-5 ทั้ง 2 ฝั่ง</p>
        </div>
      </div>

      {/* Visual Aid Area */}
      <div style={{ height: '180px', position: 'relative', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', padding: '20px', marginBottom: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px' }}>
        {[0, 1].map(comp => (
          <div key={comp} style={{ position: 'relative', height: '4px', background: 'var(--glass-border)', margin: '0 40px' }}>
             <div style={{ position: 'absolute', top: -25, left: -20, fontSize: '0.7rem', color: 'var(--text-dim)' }}>ตู้ที่ {comp + 1}</div>
             {[0, 1, 2, 3, 4, 5].map(tick => (
               <div key={tick} style={{ position: 'absolute', left: `${(tick/5)*100}%`, height: '10px', width: '2px', background: 'rgba(255,255,255,0.1)', top: -3 }} />
             ))}
             {/* Example Birds as emoji */}
             <div style={{ position: 'absolute', left: '0%', top: -25, fontSize: '1.5rem', transform: 'translateX(-50%)' }}>🐦</div>
             <div style={{ position: 'absolute', left: '40%', top: -25, fontSize: '1.5rem', transform: 'translateX(-50%)' }}>🐧</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' }}>มีวิธีจัดวางตัวละครทั้งหมดกี่วิธี?</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="number" 
            placeholder="กรอกจำนวนวิธี..." 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ flex: 1, height: '65px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 'bold' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="btn-primary" onClick={handleSubmit} style={{ height: '65px', padding: '0 40px' }}>
             ยืนยันคำตอบ
          </button>
        </div>
      </div>

      {showHint && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '25px', color: 'var(--accent)', textAlign: 'center', fontSize: '1rem', background: 'rgba(255,165,0,0.1)', padding: '15px', borderRadius: '12px' }}
        >
           <strong>คำใบ้:</strong> ลองคำนวณจำนวนวิธีในแต่ละฝั่งแล้วนำมาคูณกันดูนะ!
        </motion.p>
      )}
    </motion.div>
  )
}

export default Q1

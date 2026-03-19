import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, Play, Trophy, ArrowLeft, Loader2 } from 'lucide-react'
import { generateRoomCode } from '../utils/roomCode'
import { supabase } from '../lib/supabase'

function HomeScreen({ onStart, onOpenLeaderboard, hasPlayed }) {
  const [name, setName] = useState('')
  const [mode, setMode] = useState('initial') // initial, create, join
  const [joinCode, setJoinCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateRoom = async () => {
    if (!name.trim()) return setError('กรุณาใส่ชื่อของคุณก่อนครับ')
    setIsLoading(true)
    setError('')
    
    try {
      const code = generateRoomCode()
      const { error: roomError } = await supabase
        .from('rooms')
        .insert([{ code, status: 'waiting' }])
      
      if (roomError) throw roomError

      onStart(name, code, true)
    } catch (err) {
      setError('ไม่สามารถสร้างห้องได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!name.trim()) return setError('กรุณาใส่ชื่อของคุณก่อนครับ')
    if (joinCode.length !== 4) return setError('รหัสห้องต้องมี 4 หลักครับ')
    setIsLoading(true)
    setError('')

    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', joinCode.toUpperCase())
        .single()
      
      if (roomError || !room) {
        setError('ไม่พบห้องที่ระบุ กรุณาตรวจสอบรหัสอีกครั้ง')
      } else if (room.status !== 'waiting') {
        setError('ห้องนี้เริ่มเกมไปแล้ว หรือจบเกมไปแล้วครับ')
      } else {
        onStart(name, joinCode.toUpperCase(), false)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าร่วมห้อง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="screen-container home-screen"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/assets/backgrounds/1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-panel" style={{ padding: '60px 40px', maxWidth: '450px', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '2px solid rgba(212, 175, 55, 0.2)' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="title-gradient" style={{ 
            fontSize: '4rem', 
            marginBottom: '5px', 
            letterSpacing: '-2px',
            background: 'linear-gradient(to bottom, #fff, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'
          }}>Swallows</h1>
          <h2 style={{ fontSize: '1.4rem', color: '#B8860B', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: '900' }}>บนสายวิเศษ</h2>
          
          <AnimatePresence mode="wait">
            {mode === 'initial' ? (
              <motion.div key="initial" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <p style={{ marginBottom: '40px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {hasPlayed ? (
                    <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>ภารกิจเสร็จสิ้น! คุณได้เดินทางมาถึงจุดหมายแล้ว</span>
                  ) : (
                    <>ขอต้อนรับผู้กล้าเข้าสู่ศึกคำนวณ <br/> <span style={{ color: '#FFD700' }}>"เจ้านกนางแอ่นบนสายอาคม"</span></>
                  )}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {!hasPlayed && (
                    <>
                      <input 
                        type="text" 
                        placeholder="นามของคุณจอมเวทย์" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ 
                          textAlign: 'center', 
                          fontSize: '1.2rem', 
                          padding: '22px', 
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <button 
                          onClick={() => setMode('create')}
                          style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '16px',
                            borderRadius: '16px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontWeight: '600'
                          }}
                        >
                          <PlusCircle size={20} color="#FFD700" /> สร้างสำนัก
                        </button>
                        <button 
                          onClick={() => setMode('join')}
                          style={{ 
                            background: 'rgba(255,255,255,0.05)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '16px',
                            borderRadius: '16px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontWeight: '600'
                          }}
                        >
                          <Users size={20} color="#FFD700" /> เข้าสำนักเพื่อน
                        </button>
                      </div>
                    </>
                  )}
                  <button 
                    onClick={onOpenLeaderboard} 
                    style={{ 
                      background: hasPlayed ? 'var(--primary-glow)' : 'transparent',
                      border: hasPlayed ? '1px solid var(--accent)' : 'none',
                      borderRadius: '16px',
                      padding: hasPlayed ? '20px' : '0',
                      color: hasPlayed ? 'white' : 'rgba(212, 175, 55, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: hasPlayed ? '1.2rem' : '0.9rem',
                      fontWeight: hasPlayed ? 'bold' : 'normal',
                      marginTop: hasPlayed ? '0' : '10px'
                    }}
                  >
                    <Trophy size={hasPlayed ? 24 : 18} /> {hasPlayed ? 'ดูหอคอยเกียรติยศ' : 'หอคอยเกียรติยศ (Leaderboard)'}
                  </button>
                </div>
              </motion.div>
            ) : mode === 'create' ? (
              <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ marginBottom: '10px', color: '#FFD700' }}>เตรียมเปิดสำนักใหม่</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>คุณจะได้รับหน้าที่เป็น "เจ้าสำนัก" ในครั้งนี้</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <button className="btn-primary" onClick={handleCreateRoom} disabled={isLoading} style={{ height: '75px', fontSize: '1.4rem' }}>
                    {isLoading ? <Loader2 className="spin" /> : 'อัญเชิญสำนัก'}
                  </button>
                  <button 
                    onClick={() => setMode('initial')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <ArrowLeft size={18} /> ย้อนกลับ
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="join" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 style={{ marginBottom: '10px', color: '#FFD700' }}>ผนึกรหัสผ่าน</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>ร่ายรหัส 4 หลักเพื่อเข้าสู่สำนักเพื่อน</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="????" 
                    maxLength={4}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    style={{ 
                      textAlign: 'center', 
                      fontSize: '3rem', 
                      padding: '20px', 
                      letterSpacing: '12px', 
                      fontWeight: '900',
                      color: '#FFD700',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(212, 175, 55, 0.4)'
                    }}
                  />
                  <button className="btn-primary" onClick={handleJoinRoom} disabled={isLoading} style={{ height: '75px', fontSize: '1.4rem' }}>
                    {isLoading ? <Loader2 className="spin" /> : 'พุ่งทะยานเข้าสำนัก!'}
                  </button>
                  <button 
                    onClick={() => setMode('initial')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <ArrowLeft size={18} /> ย้อนกลับ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '20px' }}>
              ⚠️ {error}
            </motion.p>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '40px', fontSize: '0.8rem', color: 'var(--text-dim)', opacity: 0.5, letterSpacing: '2px' }}>
        MATHMO • รุ่นในห้องเรียนออนไลน์
      </div>
    </motion.div>
  )
}

function ResetButton({ onReset }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      whileHover={{ opacity: 1, scale: 1.05 }}
      onClick={() => {
        if (confirm('คุณต้องการล้างข้อมูลเพื่อเริ่มเล่นใหม่ใช่หรือไม่?')) {
          onReset();
        }
      }}
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'white',
        padding: '8px 15px',
        fontSize: '0.75rem',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      🔄 ล้างข้อมูลเริ่มใหม่
    </motion.button>
  )
}

export default function HomeScreenWrapper(props) {
  return (
    <>
      <HomeScreen {...props} />
      {props.hasPlayed && <ResetButton onReset={props.onReset} />}
    </>
  )
}

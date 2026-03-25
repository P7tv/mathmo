import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Users, Trophy, ArrowLeft, Loader2 } from 'lucide-react'
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
      setError('ไม่สามารถสร้างห้องได้ กรุณาลองใหมีกครั้ง')
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
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(/assets/bg1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="glass-panel text-center">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="title-gradient" style={{
            fontSize: 'min(5rem, 15vw)',
            marginBottom: '0.5rem',
            letterSpacing: '-2px',
            background: 'linear-gradient(to bottom, #fff, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))'
          }}>Swallows</h1>
          <h2 style={{ fontSize: 'min(1.4rem, 5vw)', color: '#B8860B', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: '900' }}>บนสายวิเศษ</h2>

          <AnimatePresence mode="wait">
            {mode === 'initial' ? (
              <motion.div key="initial" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                <p style={{ marginBottom: '2.5rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {hasPlayed ? (
                    <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>ภารกิจเสร็จสิ้น! คุณได้เดินทางมาถึงจุดหมายแล้ว</span>
                  ) : (
                    <>ขอต้อนรับผู้กล้าเข้าสู่ศึกคำนวณ <br /> <span style={{ color: '#FFD700' }}>"รถไฟบ็อบ"</span></>
                  )}
                </p>
                <div className="flex-column" style={{ gap: '1.5rem' }}>
                  {!hasPlayed && (
                    <>
                      <input
                        type="text"
                        placeholder="นามของคุณจอมเวทย์"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-center"
                        style={{ fontSize: '1.2rem', padding: '1.25rem' }}
                      />

                      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMode('create')}
                          className="btn-outline w-full"
                          style={{'--glass-border': 'rgba(212, 175, 55, 0.4)', color: '#FFD700', height: '60px'}}
                        >
                          <PlusCircle size={20} /> สร้างห้อง
                        </motion.button>

                        <motion.button 
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMode('join')}
                          className="btn-outline w-full"
                          style={{'--glass-border': 'rgba(212, 175, 55, 0.4)', color: '#FFD700', height: '60px'}}
                        >
                          <Users size={20} /> เข้าร่วม
                        </motion.button>
                      </div>
                    </>
                  )}
                  <button
                    onClick={onOpenLeaderboard}
                    className={hasPlayed ? "btn-primary" : ""}
                    style={!hasPlayed ? {
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(212, 175, 55, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                    } : {}}
                  >
                    <Trophy size={hasPlayed ? 22 : 18} /> {hasPlayed ? 'ดูหอคอยเกียรติยศ' : 'หอคอยเกียรติยศ'}
                  </button>
                </div>
              </motion.div>
            ) : mode === 'create' ? (
              <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="mb-4" style={{ color: '#FFD700' }}>เตรียมเปิดสำนักใหม่</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>คุณจะได้รับหน้าที่เป็น "เจ้าสำนัก"</p>
                <div className="flex-column" style={{ gap: '1rem' }}>
                  <button className="btn-primary" onClick={handleCreateRoom} disabled={isLoading} style={{ height: '70px', fontSize: '1.25rem' }}>
                    {isLoading ? <Loader2 className="spin" /> : 'อัญเชิญสำนัก'}
                  </button>
                  <button
                    onClick={() => setMode('initial')}
                    className="btn-outline"
                    style={{ border: 'none', color: 'var(--text-dim)' }}
                  >
                    <ArrowLeft size={18} /> ย้อนกลับ
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="join" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="mb-4" style={{ color: '#FFD700' }}>ผนึกรหัสผ่าน</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>ร่ายรหัส 4 หลักเพื่อเข้าสู่สำนัก</p>
                <div className="flex-column" style={{ gap: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="????"
                    maxLength={4}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="text-center"
                    style={{
                      fontSize: 'min(3rem, 12vw)',
                      letterSpacing: '0.5rem',
                      fontWeight: '900',
                      color: '#FFD700',
                    }}
                  />
                  <button className="btn-primary" onClick={handleJoinRoom} disabled={isLoading} style={{ height: '70px', fontSize: '1.25rem' }}>
                    {isLoading ? <Loader2 className="spin" /> : 'พุ่งทะยานเข้าสำนัก!'}
                  </button>
                  <button
                    onClick={() => setMode('initial')}
                    className="btn-outline"
                    style={{ border: 'none', color: 'var(--text-dim)' }}
                  >
                    <ArrowLeft size={18} /> ย้อนกลับ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '1.5rem' }}>
              ⚠️ {error}
            </motion.p>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', fontSize: '0.75rem', color: 'var(--text-dim)', opacity: 0.5, letterSpacing: '2px' }}>
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
        bottom: '1rem',
        right: '1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'white',
        padding: '0.5rem 1rem',
        fontSize: '0.7rem',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      🔄 ล้างข้อมูล
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

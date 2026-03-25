import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Q1 from './questions/Q1'
import Q2 from './questions/Q2'
import Q3 from './questions/Q3'
import Q4 from './questions/Q4'
import SpinWheel from './SpinWheel'
import StealModal from './StealModal'
import MiniLeaderboard from './MiniLeaderboard'
import { supabase } from '../lib/supabase'

function GameScreen({ playerName, playerId, roomCode, onFinish }) {
  const [currentStep, setCurrentStep] = useState(1) // 1 to 4
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [score, setScore] = useState(0)
  const [startTime] = useState(Date.now())
  const [showFeedback, setShowFeedback] = useState(null) // 'correct', 'incorrect'

  const [isFinishingQuestion, setIsFinishingQuestion] = useState(false)
  const [isMovingTrain, setIsMovingTrain] = useState(false)
  const [activeEvent, setActiveEvent] = useState(null) // 'wheel', 'steal'
  const [avatar, setAvatar] = useState('W1.png')

  useEffect(() => {
    if (playerId) {
      supabase.from('players').select('avatar').eq('id', playerId).single()
        .then(({ data }) => {
          if (data?.avatar) setAvatar(data.avatar)
        })
    }
  }, [playerId])

  // Sync score to Supabase
  useEffect(() => {
    if (playerId) {
      supabase
        .from('players')
        .update({ score, current_step: currentStep })
        .eq('id', playerId)
        .then()
    }
  }, [score, currentStep, playerId])

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const isMobile = windowWidth < 768

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
      setScore(prev => prev + 500) // Base points for correct answer
      setShowFeedback('correct')
      
      setTimeout(() => {
        setShowFeedback(null)
        setActiveEvent('wheel')
      }, 1500)
    } else {
      setShowFeedback('incorrect')
      setTimeout(() => {
        setShowFeedback(null)
        moveToNext()
      }, 1500)
    }
  }

  const handleWheelResult = (result) => {
    if (result.value === 'steal') {
      setActiveEvent('steal')
      return
    }

    // Apply other results
    if (typeof result.value === 'number') {
      setScore(prev => Math.max(0, prev + result.value))
    } else if (result.value === 'x2') {
      setScore(prev => prev * 2)
    } else if (result.value === 'reset') {
      setScore(0)
    } else if (result.value === 'shield') {
      if (playerId) {
        supabase.from('players').update({ is_shielded: true }).eq('id', playerId).then()
      }
    }

    setTimeout(() => {
      setActiveEvent(null)
      moveToNext()
    }, 1500)
  }

  const handleStealResult = async ({ target, amount }) => {
    setScore(prev => prev + amount)
    
    if (playerId) {
       await supabase.rpc('steal_points', { 
         stealer_id: playerId, 
         target_id: target.id, 
         amount: amount 
       })
    }
    
    setTimeout(() => {
      setActiveEvent(null)
      moveToNext()
    }, 1500)
  }

  const moveToNext = () => {
    setIsFinishingQuestion(true) // Phase 1: Question content fades out
    
    setTimeout(() => {
      setIsMovingTrain(true) // Phase 2: Train slides out of view (to the right)
      
      setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep(prev => prev + 1)
          setIsFinishingQuestion(false)
          
          // Phase 3: Wait for background change then reset train
          setTimeout(() => {
            setIsMovingTrain(false) // Phase 4: Train slides back in from left
          }, 800)
        } else {
          finishGame()
        }
      }, 1500) // Train slide out duration
    }, 800)
  }

  const finishGame = async () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    if (playerId) {
      await supabase
        .from('players')
        .update({ score, total_time: totalTime, current_step: 5 })
        .eq('id', playerId)
    }

    // Phase 1: Final train slide out
    setIsMovingTrain(true)
    
    setTimeout(() => {
      // Phase 2: Fade to black
      const overlay = document.createElement('div')
      overlay.style.position = 'fixed'
      overlay.style.top = '0'
      overlay.style.left = '0'
      overlay.style.width = '100vw'
      overlay.style.height = '100vh'
      overlay.style.backgroundColor = 'black'
      overlay.style.zIndex = '9999'
      overlay.style.opacity = '0'
      overlay.style.transition = 'opacity 2s ease-in-out'
      document.body.appendChild(overlay)
      
      // Force reflow
      overlay.offsetHeight
      overlay.style.opacity = '1'
      
      // Phase 3: Redirect to home
      setTimeout(() => {
        sessionStorage.setItem('game_completed', 'true')
        window.location.href = '/'
      }, 2500)
    }, 1500)
  }

  const [bgImage, setBgImage] = useState('/assets/bg1.png')

  useEffect(() => {
    setBgImage(`/assets/bg${Math.min(3, currentStep)}.png`)
  }, [currentStep])

  return (
    <div className="game-container" style={{ 
      height: '100%', 
      width: '100%', 
      overflow: 'hidden', 
      position: 'relative', 
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'background-image 1s ease-in-out'
    }}>
        
        {/* SIDEBAR LEADERBOARD */}
        {!isMobile && (
          <div style={{ position: 'relative', zIndex: 50, padding: '1rem', display: 'flex', alignItems: 'center', width: '250px' }}>
             <MiniLeaderboard roomCode={roomCode} currentPlayerId={playerId} />
          </div>
        )}

        {/* MAIN GAME AREA */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <AnimatePresence mode="wait">
                 <motion.div 
                    key={`train-container-${currentStep}`}
                    initial={{ x: '-150%' }}
                    animate={{ x: isMovingTrain ? '150%' : 0 }}
                    exit={{ x: '150%' }}
                    transition={{ 
                      x: { duration: 1.5, ease: [0.4, 0, 0.2, 1] } 
                    }}
                    style={{
                        position: 'absolute',
                        width: isMobile ? '90%' : 'min(1100px, 80vw)',
                        height: isMobile ? 'auto' : '350px',
                        minHeight: isMobile ? '400px' : '350px',
                        backgroundImage: isMobile ? 'none' : `url(/assets/Train.png)`,
                        backgroundColor: isMobile ? 'rgba(0,0,0,0.4)' : 'transparent',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: isMobile ? '2rem' : '0',
                        backdropFilter: isMobile ? 'blur(10px)' : 'none',
                        border: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
                        padding: isMobile ? '1.5rem' : '0'
                    }}
                >
                    <AnimatePresence>
                      {!isMovingTrain && !isFinishingQuestion && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}
                        >
                            {currentStep === 1 && <Q1 onResult={handleAnswer} playerAvatar={avatar} />}
                            {currentStep === 2 && <Q2 onResult={handleAnswer} playerAvatar={avatar} />}
                            {currentStep === 3 && <Q3 onResult={handleAnswer} playerAvatar={avatar} />}
                            {currentStep === 4 && <Q4 onResult={handleAnswer} playerAvatar={avatar} />}
                        </motion.div>
                      )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* FEEDBACK OVERLAY */}
        <AnimatePresence>
            {showFeedback && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: showFeedback === 'correct' ? 'rgba(0, 255, 127, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="glass-panel text-center" style={{ 
                        border: showFeedback === 'correct' ? '2px solid #00FF7F' : '2px solid #FF3B30',
                        boxShadow: showFeedback === 'correct' ? '0 0 50px rgba(0,255,127,0.3)' : '0 0 50px rgba(255,59,48,0.3)',
                        maxWidth: '400px',
                    }}>
                        <div className="flex-column items-center mb-4">
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                backgroundImage: showFeedback === 'correct' ? `url(/assets/${avatar})` : 'none',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                            }}>
                                {showFeedback === 'incorrect' && <div style={{ fontSize: '3rem' }}>❌</div>}
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', color: 'white' }}>
                            {showFeedback === 'correct' ? '✨ ถูกต้อง ✨' : '❌ ลองใหม่นะ ❌'}
                        </h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* SCORE STATUS */}
        <div style={{ 
            position: 'absolute', 
            top: '1.25rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 100,
            display: 'flex',
            gap: '1rem',
            width: 'max-content'
        }}>
            <div className="glass-panel" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ข้อที่ {currentStep} / 4
            </div>
            <div className="glass-panel" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.8rem', fontWeight: 'bold', color: '#FBBF24', border: '1px solid #FBBF24' }}>
                คะแนน: {score.toLocaleString()}
            </div>
        </div>

        {/* RANDOM EVENTS & WHEEL */}
        <AnimatePresence>
          {activeEvent === 'wheel' && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '1rem' }}>
              <SpinWheel onResult={handleWheelResult} />
            </div>
          )}
          {activeEvent === 'steal' && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '1rem' }}>
              <StealModal 
                roomCode={roomCode} 
                currentPlayerId={playerId} 
                onSteal={handleStealResult} 
              />
            </div>
          )}
        </AnimatePresence>
    </div>
  )
}

export default GameScreen

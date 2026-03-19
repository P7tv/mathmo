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
          setIsMovingTrain(false) // Reset train position to off-screen left for next enter
        } else {
          finishGame()
        }
      }, 1000) // Train slide out duration
    }, 500)
  }

  const finishGame = async () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    if (playerId) {
      await supabase
        .from('players')
        .update({ score, total_time: totalTime, current_step: 5 })
        .eq('id', playerId)
    }

    // Phase 3: Final Fade to Black
    const overlay = document.createElement('div')
    overlay.className = 'fade-to-black'
    document.body.appendChild(overlay)
    
    setTimeout(() => overlay.classList.add('active'), 100)

    setTimeout(() => {
      onFinish(true) // Pass 'completed' flag to App/Home
      setTimeout(() => {
        overlay.classList.remove('active')
        setTimeout(() => document.body.removeChild(overlay), 1500)
      }, 500)
    }, 2000)
  }

  return (
    <div className="game-container" style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative', display: 'flex' }}>
        
        {/* SIDEBAR LEADERBOARD */}
        <div style={{ position: 'relative', zIndex: 50, padding: '20px', display: 'flex', alignItems: 'center' }}>
           <MiniLeaderboard roomCode={roomCode} currentPlayerId={playerId} />
        </div>

        {/* MAIN GAME AREA */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        <AnimatePresence mode="wait">
             <motion.div 
                key={`train-container-${currentStep}`}
                initial={{ x: '-120%' }}
                animate={{ x: isMovingTrain ? '120%' : 0 }}
                exit={{ x: '120%' }}
                transition={{ 
                  x: { duration: 1, ease: [0.4, 0, 0.2, 1] } 
                }}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(/assets/backgrounds/2.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {/* Question content appears only when train has stopped */}
                <AnimatePresence>
                  {!isMovingTrain && !isFinishingQuestion && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 1, duration: 0.5 }} // Wait for train to arrive
                        className="question-overlay"
                        style={{ 
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px',
                            zIndex: 10
                        }}
                    >
                        {currentStep === 1 && <Q1 onResult={handleAnswer} />}
                        {currentStep === 2 && <Q2 onResult={handleAnswer} />}
                        {currentStep === 3 && <Q3 onResult={handleAnswer} />}
                        {currentStep === 4 && <Q4 onResult={handleAnswer} />}
                    </motion.div>
                  )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
        </div>

        {/* FEEDBACK OVERLAY */}

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
                    <div className="glass-panel" style={{ 
                        padding: '40px 80px', 
                        textAlign: 'center',
                        border: showFeedback === 'correct' ? '2px solid #00FF7F' : '2px solid #FF3B30',
                        boxShadow: showFeedback === 'correct' ? '0 0 50px rgba(0,255,127,0.3)' : '0 0 50px rgba(255,59,48,0.3)'
                    }}>
                        <h2 style={{ fontSize: '4rem', color: 'white' }}>
                            {showFeedback === 'correct' ? '✨ ถูกต้อง ✨' : '❌ ลองใหม่อีกครั้ง ❌'}
                        </h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* SCORE STATUS */}
        <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 100,
            display: 'flex',
            gap: '20px'
        }}>
            <div className="glass-panel" style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                ข้อที่ {currentStep} / 4
            </div>
            <div className="glass-panel" style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: 'bold', color: '#FBBF24', border: '1px solid #FBBF24' }}>
                คะแนน: {score.toLocaleString()}
            </div>
        </div>
    </div>
  )
}

export default GameScreen

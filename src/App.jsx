import { useState, useRef, useEffect } from 'react'
import beepsound from './assets/alarm-clock-short-6402.mp3'
import './App.css'

function App() {
  const [breakLen, setBreakLen] = useState(5)
  const [sessionLen, setSessionLen] = useState(25)
  const [timeactive, setTimeactive] = useState(null)
  const timeLabel = useRef()
  const time = useRef()
  const beep = useRef()


  useEffect(() => {
    if (timeLabel.current.innerText == "Session")
      time.current.innerText = numtotime(sessionLen) + ":00"
      time.current.classList.remove("red")
      timeLabel.current.classList.remove("red")
  }, [sessionLen])

  useEffect(() => {
    if (timeLabel.current.innerText == "Break") {
      time.current.innerText = numtotime(breakLen) + ":00"
      time.current.classList.remove("red")
      timeLabel.current.classList.remove("red")
    }
  }, [breakLen])

  const reset = () => {
    beep.current.currentTime = 0
    beep.current.pause()

    clearInterval(timeactive)
    setTimeactive(null)
    setBreakLen(5)
    setSessionLen(25)

    time.current.innerText = numtotime(sessionLen) + ":00"   
    timeLabel.current.innerText = "Session"
    time.current.classList.remove("red")
    timeLabel.current.classList.remove("red")
  }

  //Dom
  const numtotime = (num) => {
    let min = num.toString()
    if (min.length == 1) {
      min = "0" + min
    }
    return min
  }

  const timeplay = () => {
    if (timeactive == null) {

      const ms = 1000
      let txt
      let minute
      let sec
      //timeplay
      const timeStart = setInterval(() => {

        txt = time.current.innerText
        sec = parseInt(txt.split(':')[1])
        minute = parseInt(txt.split(':')[0])

        if (sec == 0) {
          sec = 60
          minute -= 1
        }
        sec -= 1
        time.current.innerText = numtotime(minute) + ":" + numtotime(sec)

        //check on time
        if (minute == 0){
          time.current.classList.add("red")
          timeLabel.current.classList.add("red")
        }else{
          time.current.classList.remove("red")
          timeLabel.current.classList.remove("red")
        }



        if (txt == "00:00") {
          time.current.innerText = "00:00"
          //session == 00.00
          if (timeLabel.current.innerText != "Break") {
            timeLabel.current.innerText = "Break"
            time.current.innerText = numtotime(breakLen) + ":00"// useRef ไม่ render ใหม่
          }

          //break = 00.00
          else if (timeLabel.current.innerText != "Session") {
            timeLabel.current.innerText = "Session"
            time.current.innerText = numtotime(sessionLen) + ":00"
          }

          beep.current.currentTime = 0
          beep.current.play()

        }
      }, ms);

      setTimeactive(timeStart)

    }
    else if (timeactive) {
      clearInterval(timeactive)
      setTimeactive(null)
    }

  }



  return (
    <>
      <div id="break-label">
        <button id="break-decrement"
          onClick={() => { timeactive == null && breakLen > 1 && setBreakLen(breakLen - 1)}}>
            {/* useReducer */}
          decrement
        </button>
        <p className="" id="break-length">{breakLen}</p>
        <button id="break-increment"
          onClick={() => { timeactive == null && breakLen < 60 && setBreakLen(breakLen + 1) }}>
          increment
        </button>
      </div>

      <div id="session-label">
        <button id="session-decrement"
          onClick={() => { timeactive == null && sessionLen > 1 && setSessionLen(sessionLen - 1)}}>
          decrement
        </button>
        <p className="" id="session-length">{sessionLen}</p>
        <button id="session-increment"
          onClick={() => { timeactive == null && sessionLen < 60 && setSessionLen(sessionLen + 1) }}>
          increment
        </button>
      </div>

      <div>
        <p id="timer-label" ref={timeLabel}>Session</p>
        <h1 id="time-left" ref={time}></h1>
      </div>

      <div className='control'>
        <button id="start_stop" onClick={timeplay}>{timeactive==null?"start":"stop"}</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>

      <audio src={beepsound} id="beep" ref={beep}></audio>
    </>
  )
}

export default App


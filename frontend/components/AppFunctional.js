import React, {useState} from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  const coordinates = [
    '(1, 1)',
    '(2, 1)',
    '(3, 1)',
    '(1, 2)',
    '(2, 2)',
    '(3, 2)',
    '(1, 3)',
    '(2, 3)',
    '(3, 3)',
  ]

  function getX() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return parseInt(coordinates[index][1]);
  }

  function getY() {
    return parseInt(coordinates[index][4]);
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return ( 'Coordinates ' + coordinates[index] )
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setSteps(initialSteps);
    setIndex(initialIndex);
    setEmail(initialEmail);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction.target.id === 'left') {
      if (getX() !== 1) {
        setMessage(initialMessage);
        setIndex(index - 1);
        setSteps(steps+1)
      }
      else setMessage("You can't go " + direction.target.id)
    }
    if (direction.target.id === 'right') {
      if (getX() !== 3) {
        setMessage(initialMessage);
        setIndex(index + 1);
        setSteps(steps+1)
      }
      else setMessage("You can't go " + direction.target.id)
    }
    if (direction.target.id === 'up') {
      if (getY() !== 1) {
        setMessage(initialMessage);
        setIndex(index - 3);
        setSteps(steps+1)
      }
      else setMessage("You can't go " + direction.target.id)
    }
    if (direction.target.id === 'down') {
      if (getY() !== 3) {
        setMessage(initialMessage);
        setIndex(index + 3);
        setSteps(steps+1)
      }
      else setMessage("You can't go " + direction.target.id)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', 
    {
      "x": getX(),
      "y": getY(),
      "steps": steps, 
      "email": email
    }
    )
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        setMessage(error.response.data.message)
      }) 
      setEmail(initialEmail);
  }

  return (
    <div id="wrapper" className={props.className}>


      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1? 'time' : 'times'}</h3>
      </div>


      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>



      <div className="info">
        <h3 id="message">{message}</h3>
      </div>



      <div id="keypad">
        <button id="left" onClick={getNextIndex}>LEFT</button>
        <button id="up" onClick={getNextIndex}>UP</button>
        <button id="right" onClick={getNextIndex}>RIGHT</button>
        <button id="down" onClick={getNextIndex}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>


      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}

import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

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

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  constructor () {
    super();
      this.state = initialState

      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      // this.setEmail = this.setEmail.bind(this);
      // this.setMessage = this.setMessage.bind(this);
      // this.setIndex = this.setIndex.bind(this);
      // this.setSteps = this.setSteps.bind(this);

  }

  setMessage = (input) => {
    this.setState({message: input});
  }
  setEmail = (input) => {
    this.setState({email: input});
  }
  setSteps = (input) => {
    this.setState({steps: input});
  }
  setIndex = (input) => {
    this.setState({index: input});
  }

  getX() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return parseInt(coordinates[this.state.index][1]);
  }

  getY() {
    return parseInt(coordinates[this.state.index][4]);
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return ( 'Coordinates ' + coordinates[this.state.index] )
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState);
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction.target.id === 'left') {
      if (this.getX() !== 1) {
        this.setMessage(initialMessage);
        this.setIndex(this.state.index - 1);
        this.setSteps(this.state.steps + 1);
      }
      else this.setMessage("You can't go " + direction.target.id);
    }
    if (direction.target.id === 'right') {
      if (this.getX() !== 3) {
        this.setMessage(initialMessage);
        this.setIndex(this.state.index + 1);
        this.setSteps(this.state.steps + 1);
      }
      else this.setState({message: "You can't go " + direction.target.id});
    }
    if (direction.target.id === 'up') {
      if (this.getY() !== 1) {
        this.setMessage(initialMessage);
        this.setIndex(this.state.index - 3);
        this.setSteps(this.state.steps + 1);
      }
      else this.setMessage("You can't go " + direction.target.id);
    }
    if (direction.target.id === 'down') {
      if (this.getY() !== 3) {
        this.setMessage(initialMessage);
        this.setIndex(this.state.index + 3);
        this.setSteps(this.state.steps + 1);
      }
      else this.setMessage("You can't go " + direction.target.id);
    }
  }

  onChange(evt) {
    // You will need this to update the value of the input.
    this.setEmail(evt.target.value);
  }

  onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post('http://localhost:9000/api/result', 
    {
      "x": this.getX(),
      "y": this.getY(),
      "steps": this.state.steps, 
      "email": this.state.email,
    }
    )
      .then(response => {
        this.setMessage(response.data.message)
      })
      .catch(error => {
        this.setMessage(error.response.data.message)
      })
    this.setEmail(initialEmail);
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
        <button id="left" onClick={this.getNextIndex}>LEFT</button>
        <button id="up" onClick={this.getNextIndex}>UP</button>
        <button id="right" onClick={this.getNextIndex}>RIGHT</button>
        <button id="down" onClick={this.getNextIndex}>DOWN</button>
        <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}

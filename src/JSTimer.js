import React from 'react';
import './App.scss';
import TimerLength from './TimerLength.js';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fas,
  faPlay,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(fas, faPlay, faSyncAlt);

const accurateInterval = (fn, time) => {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = () => {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = () => {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};

class JSTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      displayMinutes: 25,
      displayZeroSec: "0",
      displayZeroMin: "",
      displaySeconds: 0,
      timerState: "stopped",
      displaySession: "Session"
    };
    this.handleBreak = this.handleBreak.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.handleLenght = this.handleLenght.bind(this);
    this.reset = this.reset.bind(this);
    this.playSession = this.playSession.bind(this);
    this.playMinutes = this.playMinutes.bind(this);
    this.alarmBip = this.alarmBip.bind(this);
  }

  handleBreak(e) {
    this.handleLenght(
      e.currentTarget.value,
      "Session",
      this.state.breakLength,
      "breakLength"
    );
  }

  handleSession(e) {
    this.handleLenght(
      e.currentTarget.value,
      "Break",
      this.state.sessionLength,
      "sessionLength"
    );
  }

  handleLenght(currVal, session, stateLength, lengths) {
    const value = currVal;
    const one = parseInt(value);
    if (
      (this.state.timerState === "stopped" && one === 1 && stateLength < 60) ||
      (this.state.timerState === "stopped" && one === -1 && stateLength > 1)
    ) {
      if (this.state.displaySession === session) {
        this.setState({
          [lengths]: stateLength + one
        });
      } else if (one === -1) {
        if (this.state.displayMinutes > 10) {
          this.setState({
            [lengths]: stateLength + one,
            displayMinutes: stateLength + one,
            displayZeroMin: "",
            displaySeconds: 0,
            displayZeroSec: "0"
          });
        } else {
          this.setState({
            [lengths]: stateLength + one,
            displayMinutes: stateLength + one,
            displayZeroMin: "0",
            displaySeconds: 0,
            displayZeroSec: "0"
          });
        }
      } else {
        if (this.state.displayMinutes >= 9) {
          this.setState({
            [lengths]: stateLength + one,
            displayMinutes: stateLength + one,
            displayZeroMin: "",
            displaySeconds: 0,
            displayZeroSec: "0"
          });
        } else {
          this.setState({
            [lengths]: stateLength + one,
            displayMinutes: stateLength + one,
            displayZeroMin: "0",
            displaySeconds: 0,
            displayZeroSec: "0"
          });
        }
      }
    }
  }

  playMinutes() {
    if (this.state.displayMinutes <= 10) {
      this.setState({
        displayMinutes: this.state.displayMinutes - 1,
        displayZeroMin: "0"
      });
    } else {
      this.setState({
        displayMinutes: this.state.displayMinutes - 1,
        displayZeroMin: ""
      });
    }
  }

  playSession() {
    if (this.state.timerState === "stopped") {
      this.myInterval = accurateInterval(() => {
        this.alarmBip();
        if (this.state.displaySeconds === 0 && this.state.displayMinutes !== 0) {
          this.playMinutes();
          this.setState({
            displayZeroSec: "",
            displaySeconds: 59,
            timerState: "running"
          });
        } else if (
          this.state.displaySeconds > 0 &&
          this.state.displaySeconds <= 59
        ) {
          if (this.state.displaySeconds <= 10) {
            this.setState({
              displayZeroSec: "0",
              displaySeconds: this.state.displaySeconds - 1,
              timerState: "running"
            });
          } else {
            this.setState({
              displayZeroSec: "",
              displaySeconds: this.state.displaySeconds - 1,
              timerState: "running"
            });
          }
        } else if (
          this.state.displayMinutes === 0 &&
          this.state.displaySeconds === 0 &&
          this.state.displaySession === "Session"
        ) {
          this.setState({
            displaySeconds: 0,
            displayMinutes: this.state.breakLength,
            displaySession: "Break",
            timerState: "stopped"
          });
        } else if (
          this.state.displayMinutes === 0 &&
          this.state.displaySeconds === 0 &&
          this.state.displaySession === "Break"
        ) {
          this.setState({
            displaySeconds: 0,
            displayMinutes: this.state.sessionLength,
            displaySession: "Session",
            timerState: "stopped"
          });
        }
      }, 1000);
    } else {
      this.setState({
        timerState: "stopped"
      });
      this.myInterval.cancel();
    }
  }

  alarmBip() {
    if (this.state.displayMinutes === 0 && this.state.displaySeconds === 1) {
      const audio = new Audio(
        'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav',
      )
      audio.play()
    }
  }

  reset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      displayMinutes: 25,
      displayZeroSec: "0",
      displayZeroMin: "",
      displaySeconds: 0,
      timerState: "stopped",
      displaySession: "Session"
    });
    this.myInterval.cancel();
    this.alarmBip.pause();
    this.alarmBip.currentTime = 0;
  }

  render() {
    return (
      <div id="timer">
        <div style={{ fontSize: "48px", marginBottom: "25px" }}>
          25 + 5 Clock
        </div>
        <div className="sessionControls">
          <TimerLength
            text="breaks"
            IDlabel="break-label"
            IDcontrols="break-controls"
            title="Break Length"
            onClick={this.handleBreak}
            length={this.state.breakLength}
            increment="break-increment"
            decrement="break-decrement"
            IDlength="break-length"
          />
          <TimerLength
            text="sessions"
            IDlabel="session-label"
            IDcontrols="session-controls"
            title="Session Length"
            onClick={this.handleSession}
            length={this.state.sessionLength}
            increment="session-increment"
            decrement="session-decrement"
            IDlength="session-length"
          />
        </div>
        <div
          id="display"
          style={{
            color: this.state.displayMinutes >= 1 ? "white" : "darkorange"
          }}
        >
          <p style={{ marginTop: "20px" }} id="timer-label">
            {this.state.displaySession}
          </p>
          <div
            id="time-left"
            style={{
              fontSize: "75px",
              marginTop: "-30px"
            }}
          >
            {this.state.displayZeroMin}
            {this.state.displayMinutes}:{this.state.displayZeroSec}
            {this.state.displaySeconds}
          </div>
        </div>
        <div className="btnWrapper">
          <button id="start_stop" onClick={this.playSession}>
            <FontAwesomeIcon icon="fas fa-play" />
          </button>
          <button id="reset" onClick={this.reset}>
            <FontAwesomeIcon icon="fas fa-sync-alt" />
          </button>
        </div>
        <div className="createdBy">
          by{" "}
          <a
            href="https://codepen.io/cristina_jura/full/WNONREr"
            target="blank"
          >
            Cristina Jura
          </a>
        </div>
      </div>
    );
  }
}

export default JSTimer;

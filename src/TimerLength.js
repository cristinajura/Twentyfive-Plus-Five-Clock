import './App.scss';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fas,
    faArrowUp,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";

library.add(fas, faArrowUp, faArrowDown);

const TimerLength = (props) => {
  return (
    <div className={props.text}>
      <div id={props.IDlabel}>{props.title}</div>
      <div id={props.IDcontrols}>
        <button onClick={props.onClick} id={props.increment} value="1">
          <FontAwesomeIcon icon="fas fa-arrow-up" style={{fontSize: '24px'}} />
        </button>
        <p id={props.IDlength}>{props.length}</p>
        <button onClick={props.onClick} id={props.decrement} value="-1">
          <FontAwesomeIcon icon="fas fa-arrow-down" style={{fontSize: '24px'}} />
        </button>
      </div>
    </div>
  );
};

export default TimerLength;
import { Switch } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/App';
import { SocketContext } from '../context/Socket';

export default function BallotSwitch({ dataTarget }) {
  
  // variables
  const { ballot } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  // functions
  const ballotToggle = (checked) => {
    if (checked) {
      socket.emit('hostBallotOpen', dataTarget);
    } else {
      socket.emit('hostBallotClose');
    }
  }

  return (
    <div className="tv-ballotSwitch">
      <Switch
        checked={ballot.open && (ballot.contestant.key === dataTarget.key)}
        disabled={ballot.open && (ballot.contestant.key !== dataTarget.key)}
        onClick={ballotToggle}
      />
    </div>
  );
}

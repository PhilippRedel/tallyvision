import { Switch } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';
import { SocketContext } from '../context/SocketContext';

export default function BallotSwitch({ dataTarget }) {
  
  // variables
  const { ballot } = useContext(AppContext);
  const socket = useContext(SocketContext);

  // functions
  const ballotClose = () => {
    socket.emit('hostBallotClose');
  };

  const ballotOpen = () => {
    socket.emit('hostBallotOpen', dataTarget.key);
  };

  return (
    <div className="tv-ballotSwitch">
      <Switch
        checked={ballot.open && (ballot.contestant.key === dataTarget.key)}
        disabled={ballot.open && (ballot.contestant.key !== dataTarget.key)}
        onClick={(checked, event) => {
          checked ? ballotOpen() : ballotClose();
        }}
      />
    </div>
  );
}

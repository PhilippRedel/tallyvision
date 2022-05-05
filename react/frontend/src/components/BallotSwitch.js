import { Switch } from 'antd';
import { useContext } from 'react';

import { BallotContext } from '../context/BallotContext';
import { SocketContext } from '../context/SocketContext';

export default function BallotSwitch({ dataTarget }) {
  
  // variables
  const ballot = useContext(BallotContext);
  const socket = useContext(SocketContext);

  // functions
  function ballotClose() {
    socket.emit('hostBallotClose');
  };

  function ballotOpen() {
    socket.emit('hostBallotOpen', dataTarget.code);
  };

  return (
    <div className="tv-ballotSwitch">
      <Switch
        checked={ballot.open && (ballot.contestant.code === dataTarget.code)}
        disabled={ballot.open && (ballot.contestant.code !== dataTarget.code)}
        onClick={(checked, event) => {
          checked ? ballotOpen() : ballotClose();
        }}
      />
    </div>
  );
}

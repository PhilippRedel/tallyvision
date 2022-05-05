import { Button, Form } from 'antd';
import { useContext } from 'react';

import { BallotContext } from '../context/BallotContext';
import { SocketContext } from '../context/SocketContext';

export default function GNBB() {

  // variables
  const { ballot } = useContext(BallotContext);
  const socket = useContext(SocketContext);

  // functions
  const clickGNBB = () => {
    socket.emit('clientGNBB');

    console.log('[Client] Clicked GNBB:', ballot.contestant.code);
  };

  return (
    <Form
      className="tv-GNBB"
      name="tv_GNBB"
      onFinish={clickGNBB}
    >
      <Button
        disabled={!ballot.open}
        htmlType="submit"
        type="link"
      >
        <img
          alt="Graham Norton Bitch Button"
          src={process.env.PUBLIC_URL + '/media/gnbb.png'}
        />
      </Button>
    </Form>
  );
}

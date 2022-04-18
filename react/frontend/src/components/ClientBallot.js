import { Card } from 'antd';
import { useContext } from 'react';

import { ClientSocket } from '../context/ClientSocket';
import ContestantDetails from './ContestantDetails';
import GNBB from './GNBB';
import RatingForm from './RatingForm';

export default function ClientBallot({ categories, contestant }) {

  // variables
  const socket = useContext(ClientSocket);

  // functions
  const pushGNBB = () => {
    console.log('Pushed GNBB:', contestant.code);
    socket.emit('clientPushGNBB');
  };

  const submitBallot = (values) => {
    console.log('Submitted ballot:', [contestant.code, values]);
    socket.emit('clientSubmitBallot', values);
  };

  // component
  return (
    <div className="tv-clientBallot">
      <Card bordered={false}>
        <ContestantDetails contestant={contestant} />
        <RatingForm categories={categories} onFinish={submitBallot} />
      </Card>
      <GNBB onFinish={pushGNBB} />
    </div>
  );
}

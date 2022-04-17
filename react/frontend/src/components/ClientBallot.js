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
  const ballotSubmit = (values) => {
    console.log('Submitted ballot:', contestant, values);
    socket.emit('clientBallotSubmit', values);
  };

  // component
  return (
    <div className="tv-clientBallot">
      <Card
        bordered={false}
        style={{ margin: 'auto', maxWidth: 384 }}
      >
        <ContestantDetails contestant={contestant} />
        <RatingForm categories={categories} onFinish={ballotSubmit} />
      </Card>
      <GNBB />
    </div>
  );
}

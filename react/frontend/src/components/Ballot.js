import { Button, Card } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { AppContext } from '../context/App';
import { SocketContext } from '../context/Socket';
import BallotForm from './BallotForm';
import ContestantHeading from './ContestantHeading';
import GNBB from './GNBB';
import ScoreSummary from './ScoreSummary';

export default function Ballot() {

  // variables
  const [voted, setVoted] = useState(false);
  const { ballot, ballotScore } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  // functions
  const ballotEdit = () => {
    setVoted(false);

    socket.emit('clientBallotEdit');
  }

  useEffect(() => {
    if (ballotScore.uid) {
      setVoted(true);
    }
  }, [ballotScore]);

  return (
    <div className="tv-ballot">
      <Card bordered={false}>
        <ContestantHeading contestant={ballot.contestant} />
        {voted
          ? (
            <>
              <ScoreSummary values={ballotScore} />
              <Button
                block
                onClick={ballotEdit}
                size="large"
                type="dashed"
              >
                Edit
              </Button>
            </>
          )
          : <BallotForm />
        }
      </Card>
      <GNBB />
    </div>
  );
}

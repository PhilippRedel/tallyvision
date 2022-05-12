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
  const [showBallot, setShowBallot] = useState(true);
  const { ballot, ballotScore } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  // functions
  const ballotEdit = () => {
    setShowBallot(true);

    socket.emit('clientBallotEdit');
  }

  useEffect(() => {
    if (ballotScore.uid) {
      setShowBallot(false);
    } else {
      setShowBallot(true);
    }
  }, [ballotScore]);

  return (
    <div className="tv-ballot">
      <Card bordered={false}>
        <ContestantHeading contestant={ballot.contestant} />
        {showBallot
          ? <BallotForm />
          : (
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
        }
      </Card>
      <GNBB />
    </div>
  );
}

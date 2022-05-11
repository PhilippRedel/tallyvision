import { Card } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/App';
import BallotForm from './BallotForm';
import ContestantHeading from './ContestantHeading';
import GNBB from './GNBB';
import ScoreSummary from './ScoreSummary';

export default function Ballot() {

  // variables
  const { ballot, ballotScore } = useContext(AppContext);

  return (
    <div className="tv-ballot">
      <Card bordered={false}>
        <ContestantHeading contestant={ballot.contestant} />
        {ballotScore.uid
          ? <ScoreSummary values={ballotScore} />
          : <BallotForm />
        }
      </Card>
      <GNBB />
    </div>
  );
}

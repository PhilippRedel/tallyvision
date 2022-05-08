import { Card } from 'antd';
import { useContext } from 'react';

import { AppContext } from '../context/AppContext';
import ContestantDetails from './ContestantDetails';
import GNBB from './GNBB';
import RatingForm from './RatingForm';
import RatingSummary from './RatingSummary';

export default function ClientBallot() {

  // variables
  const { ballot, ballotScore } = useContext(AppContext);

  // component
  return (
    <div className="tv-clientBallot">
      <Card bordered={false}>
        <ContestantDetails contestant={ballot.contestant} />
        {ballotScore.uid
          ? <RatingSummary values={ballotScore} />
          : <RatingForm />
        }
      </Card>
      <GNBB />
    </div>
  );
}

import { Card } from 'antd';
import { useContext } from 'react';

import { BallotContext } from '../context/BallotContext';
import ContestantDetails from './ContestantDetails';
import GNBB from './GNBB';
import RatingForm from './RatingForm';
import RatingSummary from './RatingSummary';

export default function ClientBallot({ categories }) {

  // variables
  const { ballot, ballotScore } = useContext(BallotContext);

  // component
  return (
    <div className="tv-clientBallot">
      <Card bordered={false}>
        <ContestantDetails contestant={ballot.contestant} />
        {ballotScore.uid
          ? <RatingSummary categories={categories} dataSource={ballotScore} />
          : <RatingForm categories={categories} />
        }
      </Card>
      <GNBB />
    </div>
  );
}

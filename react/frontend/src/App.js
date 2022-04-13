import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// ...
import { Button, Col, Divider, Row, Table } from 'antd';

// ...
import ContestantDetails from './components/ContestantDetails';
import BallotRate from './components/BallotRate';
import ScorecardRate from './components/ScorecardRate';

import './App.less';

function App() {
  const [categories, setCategories] = useState([]);
  const [contestants, setContestants] = useState([]);

  const columns = [
    {
      dataIndex: ['artist', 'country', 'title'],
      key: 'contestant',
      render: (value, record) => (
        <ContestantDetails contestant={record} />
      ),
      showSorterTooltip: false,
      sorter: (a, b) => a.country.localeCompare(b.country),
      title: 'Contestant',
    },
    {
      dataIndex: 'total',
      key: 'total',
      showSorterTooltip: false,
      sorter: (a, b) => a.total - b.total,
      title: 'Total Score',
    },
    Table.EXPAND_COLUMN,
  ];

  useEffect(() => {
    const socket = io('http://localhost:3030/client', {
      autoConnect: true,
    });

    socket.on('getCategories', (data) => {
      setCategories(data);
    });

    socket.on('getContestants', (data) => {
      setContestants(data);
    });
  }, []);

  return (
    <div style={{margin: '1rem auto', maxWidth: 768 }}>
      
      <Divider orientation="left">Client ballot</Divider>
      <div id="clientBallot" style={{margin: 'auto', maxWidth: 384 }}>
        <ContestantDetails
          contestant={
            {
              country: 'Country',
              code: 'gb',
              artist: 'Artist',
              title: 'Title',
              representative: '',
            }
          }
        />
        {categories.map((category) => (
          <BallotRate category={category} />
        ))}
        <Button block size="large" type="primary">Vote</Button>
      </div>
      
      <Divider orientation="left">Client scorecard</Divider>
      <div className="clientScorecard">
        <Table
          columns={columns}
          dataSource={contestants}
          expandable={{
            expandedRowRender: (record) => (
              <div className="">
                <Row gutter={[16, 16]}>
                  {categories.map((category) => (
                    <Col className="gutter-row" xs={12} md={6}>
                      <ScorecardRate category={category} value={Math.floor(Math.random() * category.max)} />
                    </Col>
                  ))}
                </Row>
              </div>
            ),
            // rowExpandable: (record) => record.total,
          }}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default App;

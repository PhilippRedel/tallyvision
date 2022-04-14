import React, { useState, useEffect } from 'react';
import { ClientSocket, socket } from './context/ClientSocket';

// ...
import { Col, Divider, Row, Table } from 'antd';

// ...
import ContestantDetails from './components/ContestantDetails';
import RatingForm from './components/RatingForm';
import RatingSummary from './components/RatingSummary';

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
      title: 'Total',
    },
    Table.EXPAND_COLUMN,
  ];

  const ballotSubmit = (values) => {
    // socket.emit('clientBallotSubmit', values);
    console.log('Success:', values);
  };

  useEffect(() => {
    socket.on('appBallotTallied', (data) => {
      console.log(data);
    });
    
    socket.on('getCategories', (data) => {
      setCategories(data);
    });

    socket.on('getContestants', (data) => {
      setContestants(data);
    });
  }, []);

  return (
    <ClientSocket.Provider value={socket}>
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
          <RatingForm categories={categories} onFinish={ballotSubmit} />
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
                      <Col key={category.key} md={6} xs={12}>
                        <RatingSummary
                          category={category}
                          value={Math.floor(Math.random() * category.max)}
                        />
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
    </ClientSocket.Provider>
  );
}

export default App;

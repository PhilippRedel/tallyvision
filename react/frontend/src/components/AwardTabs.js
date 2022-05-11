import { CrownOutlined, FrownOutlined, TrophyOutlined } from '@ant-design/icons';
import { Col, Row, Tabs } from 'antd';
import { useContext, useState } from 'react';

import { AppContext } from '../context/App';
import AwardTable from './AwardTable';
import Container from './Container';

const { TabPane } = Tabs;

export default function AwardTabs() {

  // variables
  const [tab, setTab] = useState('tab_awards');
  const {
    categories,
    scoresCategory,
    scoresGNBP,
    scoresTotal,
  } = useContext(AppContext);

  return (
    <Tabs
      activeKey={tab}
      animated
      centered
      className="tv-tabs tv-tabs--awards"
      onTabClick={setTab}
    >
      <TabPane
        key="tab_awards"
        tab={<TrophyOutlined />}
      >
        <Container view="television">
          <Row align="middle" className="tv-awardsBanner">
            <Col className="tv-awardsBanner__flag">
              <img
                alt="People's choice awards trophy"
                src={process.env.PUBLIC_URL + '/media/trophy.gif'}
              />
            </Col>
            <Col className="tv-awardsBanner__content">
              <div className="neon__row">
                People's
              </div>
              <div className="neon__row">
                Choice
              </div>
              <div className="neon__row">
                Awards 2<span className="neon__flicker-1">0</span>22
              </div>
            </Col>
          </Row>
        </Container>
      </TabPane>
      {categories.map((category) => (
        <TabPane
          key={`tab_${category.key}`}
          tab={category.label}
        >
          <Container view="television">
            <AwardTable dataSource={scoresCategory[category.key]} />
          </Container>
        </TabPane>
      ))}
      <TabPane
        key="tab_gnbp"
        tab={<FrownOutlined />}
      >
        <Container view="television">
          <AwardTable dataSource={scoresGNBP} />
        </Container>
      </TabPane>
      <TabPane
        key="tab_total"
        tab={<CrownOutlined />}
      >
        <Container view="television">
          <AwardTable dataSource={scoresTotal} total />
        </Container>
      </TabPane>
    </Tabs>
  );
}

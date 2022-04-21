import { Card } from 'antd';
import { useContext } from 'react';

import { SocketContext } from '../context/SocketContext';
import RegistrationForm from './RegistrationForm';

export default function ClientRegistration() {

  // variables
  const socket = useContext(SocketContext);

  // functions
  const submitRegistration = (values) => {
    socket.auth = {
      name: values.name.toLowerCase(),
    };

    socket.connect();
  };

  // component
  return (
    <div className="tv-clientRegistration">
      <Card bordered={false}>
        <RegistrationForm onFinish={submitRegistration} />
      </Card>
    </div>
  );
}

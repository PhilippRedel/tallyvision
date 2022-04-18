import { Card } from 'antd';
import { useContext } from 'react';

import { ClientSocket } from '../context/ClientSocket';
import RegistrationForm from './RegistrationForm';

export default function ClientRegistration() {

  // variables
  const socket = useContext(ClientSocket);

  // functions
  const submitRegistration = (values) => {
    socket.auth = {
      name: values.name.toLowerCase(),
    };

    socket.connect();
  };

  // component
  return (
    <Card bordered={false} className="tv-clientRegistration">
      <RegistrationForm onFinish={submitRegistration} />
    </Card>
  );
}

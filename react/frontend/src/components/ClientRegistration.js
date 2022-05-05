import { Card } from 'antd';

import RegistrationForm from './RegistrationForm';

export default function ClientRegistration() {

  // component
  return (
    <div className="tv-clientRegistration">
      <Card bordered={false}>
        <RegistrationForm />
      </Card>
    </div>
  );
}

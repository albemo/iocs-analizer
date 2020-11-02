import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function AlertDismissibleExample({ errorMessage }: { errorMessage: string }) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant='danger' onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh noo! Tiene un error!</Alert.Heading>
        <p> {errorMessage} </p>
      </Alert>
    );
  }
  return <></>;
}

export default AlertDismissibleExample;

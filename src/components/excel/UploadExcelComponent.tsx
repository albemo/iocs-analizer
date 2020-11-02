import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import AlertDismissibleExample from '../AlertDismissibleExample';

const UploadExcelComponent = ({
  onFileSelectSuccess,
  readFile,
}: {
  onFileSelectSuccess: any;
  readFile: any;
}) => {
  const [disabledButton, setDisabledButton] = useState(true);
  const [name, setName] = useState('');
  const [alert, setAlert] = useState(false);

  const handleFileInput = (e: any) => {
    var files = e.target.files,
      f = files[0];
    if (f) {
      if (f.size > 1024) {
        // 1 mb in Bites
        setDisabledButton(true);
        setAlert(true);
      } else {
        setName(f.name);
        setDisabledButton(false);
        var reader = new FileReader();
        reader.onload = function (e: any) {
          var data = e.target.result;
          let readedData = XLSX.read(data, { type: 'binary' });
          const wsname = readedData.SheetNames[0];
          console.log('wsname', wsname);
          const ws = readedData.Sheets[wsname];
          console.log('ws', ws);

          /* Convert array to json*/
          const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.log('dataParse', dataParse[0]);
          onFileSelectSuccess(dataParse[0]);
        };
        reader.readAsBinaryString(f);
      }
    } else {
      onFileSelectSuccess(null);
      setDisabledButton(true);
      setName('');
    }
  };

  return (
    <>
      <Form className='container mt-2 mb-2'>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <h2 className='text-center mb-4'>
            Cargar archivo de Indicadores de Compromiso
          </h2>
          <Form.Label>
            Consultar IOCs masivamente; el archivo no puede superar 1024 bytes.
            <a href='/lib/iocs-example.csv' download>
              {' '}
              archivo ejemplo
            </a>
          </Form.Label>
          <br />
          <Form.Label>
            Formato aceptado:{' '}
            <small>
              <b>.CSV</b>
            </small>
          </Form.Label>
          <Form.File
            id='custom-file'
            label={name === '' ? 'Seleccionar archivo' : name}
            custom
            onChange={handleFileInput}
            accept='.csv'
          />
        </Form.Group>
        <div className='text-center'>
          <Button
            className='mb-3 mt-3'
            variant='success'
            onClick={readFile}
            disabled={disabledButton}
          >
            Consultar IOCs
          </Button>
          {alert && (
            <AlertDismissibleExample errorMessage='Recuerde que el archivo no puede superar 1024 bytes.' />
          )}
        </div>
      </Form>
    </>
  );
};

export default UploadExcelComponent;

import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ExportExcelComponent from '../excel/ExportExcelComponent';
import UploadExcelComponent from '../excel/UploadExcelComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IiocItem {
  sha256: any;
  sha1: any;
  md5: any;
  mcafee: any;
  engines: any;
}

function IocComponentP() {
  const [iocs, setIocs] = useState<IiocItem[]>([]);
  const [ioc, setIoc] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [show, setShow] = useState(false);

  // csv
  const [iocsCsv, setIocsCsv] = useState([]);
  // show component for only one IOC
  const [showFormIoc, setShowFormIoc] = useState(true);
  // show component for only CSV IOC
  const [showFormCsvIoc, setShowFormCsvIoc] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    let iocItems: IiocItem[] = [];
    try {
      let data = await axios.get('http://localhost:5000/api/v1/iocs');
      iocItems = data.data;
      setIocs(iocItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const clearData = () => {
    handleClose();
    localStorage.clear();
    refresh();
  };

  const save = async (hash: string) => {
    const isValidHash = validateHash(hash);
    if (!isValidHash) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);
    try {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const fetchIoc = await axios(
        `${proxyurl}https://www.virustotal.com/api/v3/files/${hash}`,
        {
          headers: { 'x-apiKey': `${process.env.REACT_APP_API_KEY}` },
        }
      );
      // Success 🎉
      const item: IiocItem = {
        sha256: fetchIoc.data.data.attributes.sha256,
        sha1: fetchIoc.data.data.attributes.sha1,
        md5: fetchIoc.data.data.attributes.md5,
        mcafee:
          fetchIoc.data.data.attributes.last_analysis_results.McAfee.result,
        engines: `${
          fetchIoc.data.data.attributes.last_analysis_stats.malicious
        } / ${
          fetchIoc.data.data.attributes.last_analysis_stats.malicious +
          fetchIoc.data.data.attributes.last_analysis_stats.undetected
        }`,
      };

      await submit(item);
    } catch (error) {
      // Error 😨
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log('error.response.data', error.response.data);
        console.log('error.response.status', error.response.status);
        console.log('error.response.headers', error.response.headers);
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log('error.request', error.request);
      } else {
        // Something happened in setting up the request and triggered an Error
        console.log('error.message', error.message);
      }
      console.log('error', error);

      // si no existe en virus total, solo agregar a lo último
      let isSha256 = isSHA256(hash);
      let isSha1 = isSHA1(hash);
      let isMd5 = isMD5(hash);

      const item: IiocItem = {
        sha256: isSha256 ? hash : '',
        sha1: isSha1 ? hash : '',
        md5: isMd5 ? hash : '',
        mcafee: '',
        engines: '0 / 0',
      };

      await submit(item);
    }
    setIoc('');
    setButtonDisabled(false);
    setTextareaDisabled(false);
  };

  // validar hash con regex
  const validateHash = (hash: string): boolean => {
    let isSha256 = isSHA256(hash);
    let isSha1 = isSHA1(hash);
    let isMd5 = isMD5(hash);
    if (isSha256 || isSha1 || isMd5) return true;
    else return false;
  };

  const submit = async (item: IiocItem) => {
    let iocItems: IiocItem[] = [];
    let iocs = await axios.get('http://localhost:5000/api/v1/iocs');
    iocItems = iocs.data;
    let isExist = iocItems.some(
      (i) =>
        i.sha256 === item.sha256 && i.sha1 === item.sha1 && i.md5 === item.md5
    );

    if (isExist) {
      toast.info(`🤔 Ya existe el Ioc! ${ioc} `, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    await axios
      .post('http://localhost:5000/api/v1/iocs', item)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    refresh();
  };

  // read file
  const readFile = () => {
    iocsCsv.forEach((ioc) => {
      save(ioc);
    });
  };

  const handleWindow = (e: any) => {
    if (e.target.name === 'showFormIoc') {
      setShowFormIoc(false);
      setShowFormCsvIoc(true);
    }
    if (e.target.name === 'showFormCsvIoc') {
      setShowFormCsvIoc(false);
      setShowFormIoc(true);
    }
  };

  const isSHA256 = (hash: string): boolean => {
    const regexSHA256 = new RegExp('^[A-Fa-f0-9]{64}$');
    let isSHA256 = regexSHA256.test(hash);
    return isSHA256;
  };

  const isSHA1 = (hash: string): boolean => {
    const regexSHA1 = new RegExp('^[a-fA-F0-9]{40}$');
    let isSHA1 = regexSHA1.test(hash);
    return isSHA1;
  };

  const isMD5 = (hash: string): boolean => {
    const regexMD5 = new RegExp('^[a-f0-9]{32}$');
    let isMD5 = regexMD5.test(hash);
    return isMD5;
  };

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Same as */}
      <ToastContainer />

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>Está seguro que desea eliminar los datos?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={clearData}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* navbar intern one IOC or IOCs CVS */}
      <div className='mt-5 mb-3 d-flex container'>
        <div>
          {showFormIoc && (
            <Button name='showFormIoc' variant='link' onClick={handleWindow}>
              Ir a CSV archivo masivo
            </Button>
          )}
          {showFormCsvIoc && (
            <Button name='showFormCsvIoc' variant='link' onClick={handleWindow}>
              Ir a IOC uno a uno
            </Button>
          )}
        </div>
      </div>

      {/* Form one IOC*/}
      {showFormIoc && (
        <Form className='container mt-2 mb-2'>
          <Form.Group controlId='exampleForm.ControlTextarea1'>
            <h2 className='text-center mb-4'>
              Ingresar Indicador de Compromiso
            </h2>
            <Form.Label>Consultar IOCs uno a uno</Form.Label> <br />
            <Form.Label>
              Formatos aceptados:{' '}
              <small>
                <b>SHA256, MD5 & SHA-1</b>
              </small>
            </Form.Label>
            <Form.Control
              style={{ fontSize: '30px' }}
              as='textarea'
              rows={2}
              value={ioc}
              size={'sm'}
              onChange={(e) => setIoc(e.target.value)}
              disabled={textareaDisabled}
            />
          </Form.Group>
          <div className='text-center'>
            <Button
              className='mb-3'
              variant='success'
              onClick={() => save(ioc)}
              disabled={buttonDisabled || ioc === ''}
            >
              Consultar
            </Button>
          </div>
        </Form>
      )}

      {/* Form two or more IOCs*/}
      {showFormCsvIoc && (
        <UploadExcelComponent
          onFileSelectSuccess={(file: any) => setIocsCsv(file)}
          readFile={readFile}
        />
      )}

      {/* Data table */}
      <div className='mb-3 mr-3 d-flex justify-content-end'>
        <div>
          {/* <Button
            variant="danger"
            onClick={handleShow}
            disabled={iocs.length === 0}
          >
            Limpiar
          </Button> */}
        </div>
        <div
          className='ml-3'
          style={
            iocs.length === 0 ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          <ExportExcelComponent iocs={iocs} />
        </div>
      </div>
      <div
        className='container-fluid table-responsive'
        style={{ fontSize: '14px' }}
      >
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>SHA256</th>
              <th>SHA-1</th>
              <th>MD5</th>
              <th>McAfee</th>
              <th>Motores</th>
            </tr>
          </thead>
          <tbody>
            {iocs.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.sha256}</td>
                <td>{el.sha1}</td>
                <td>{el.md5}</td>
                <td>{el.mcafee}</td>
                <td>{el.engines}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default IocComponentP;

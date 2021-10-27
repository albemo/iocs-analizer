import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ExportExcelComponent from '../excel/ExportExcelComponent';
import UploadExcelComponent from '../excel/UploadExcelComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface IipItem {
  abuseConfidenceScore: any;
  domain: any;
  ipAddress: any;
  isp: any;
  lastReportedAt: any;
  totalReports: any;
}

function IpComponent() {
  const [ips, setIps] = useState<IipItem[]>([]);
  const [ip, setIp] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [show, setShow] = useState(false);

  // csv
  // const [iocsCsv, setIocsCsv] = useState([]);
  // show component for only one IOC
  const [showFormIp, setShowFormIp] = useState(true);
  // show component for only CSV IOC
  // const [showFormCsvIp, setShowFormCsvIp] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    // let ipItems: IipItem[] = [];
    try {
      // setIps(ipItems);
      console.log('entra', ips)
      // if(localStorage.length <= 0)
      localStorage.setItem("ips", JSON.stringify(ips));

    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const clearData = () => {
    handleClose();
    localStorage.clear();
    // refresh();
  };

  // let ipItems: IipItem[] = [];
  const save = async (ip: string) => {
    const isValidIp = validateIp(ip);
    if (!isValidIp) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);
    try {
      const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      const fetchIp = await axios(
        `${proxyurl}https://api.abuseipdb.com/api/v2/check`,
        {
          // headers: { 'Key': `${process.env.REACT_APP_API_KEY_ABUSEIP}` },
          headers: { 'Key': `673b76fb36714c2a41a73b11d30d91b2db2ea4d330e02aa7618a4ceff23e301e30afb0f8ddbb7d45` },
          params: {
            'ipAddress': `${ip}`,
            // 'ipAddress': `36.91.140.95`,
            // 'ipAddress': `118.25.6.39`,
            // 'maxAgeInDays': `90`
          }
        }
      );
      console.log('asdfadfas', fetchIp.data.data)


      // Success 🎉
      const item: IipItem = {
        abuseConfidenceScore: fetchIp.data.data.abuseConfidenceScore,
        domain: fetchIp.data.data.domain,
        ipAddress: fetchIp.data.data.ipAddress,
        isp: fetchIp.data.data.isp,
        lastReportedAt: fetchIp.data.data.lastReportedAt,
        totalReports: fetchIp.data.data.totalReports
      };

      item.lastReportedAt = Date.parse(fetchIp.data.data.lastReportedAt)

      await submit(item);

      // await submit(item);
    } catch (error) {
      // Error 😨
      // console.log('error', error);
    }
    setIp('');
    setButtonDisabled(false);
    setTextareaDisabled(false);
  };

  //validar hash con regex
  const validateIp = (ip: string): boolean => {
    let isIpv4 = isIPV4(ip);
    if (isIpv4) return true;
    else return false;
  };

  const submit = async (item: IipItem) => {
    let iocItems: IipItem[] = [];
    let iocs: any = JSON.parse(localStorage.getItem("ips") || '{}'); // await axios.get('http://localhost:3000/api/v1/iocs');
    iocItems = iocs;
    let isExist = iocItems.some(
      (i) =>
        i.ipAddress === item.ipAddress
    );

    if (isExist) {
      toast.info(`🤔 Ya existe la IP! ${ip} `, {
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



    ips.unshift(item)

    setIps(ips);

    await axios
    // .post('http://localhost:3000/api/v1/iocs', item)
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));

    refresh();
  };

  // read file
  // const readFile = () => {
  //   iocsCsv.forEach((ioc) => {
  //     save(ioc);
  //   });
  // };

  // const handleWindow = (e: any) => {
  //   if (e.target.name === 'showFormIoc') {
  //     setShowFormIoc(false);
  //     setShowFormCsvIoc(true);
  //   }
  //   if (e.target.name === 'showFormCsvIoc') {
  //     setShowFormCsvIoc(false);
  //     setShowFormIoc(true);
  //   }
  // };

  const isIPV4 = (ip: string): boolean => {
    const regexSHA256 = new RegExp('^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$');
    let isIpv4 = regexSHA256.test(ip);
    return isIpv4;
  };

  // const isSHA1 = (hash: string): boolean => {
  //   const regexSHA1 = new RegExp('^[a-fA-F0-9]{40}$');
  //   let isSHA1 = regexSHA1.test(hash);
  //   return isSHA1;
  // };

  // const isMD5 = (hash: string): boolean => {
  //   const regexMD5 = new RegExp('^[a-f0-9]{32}$');
  //   let isMD5 = regexMD5.test(hash);
  //   return isMD5;
  // };

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
      {/* <div className='mt-5 mb-3 d-flex container'>
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
      </div> */}

      {/* Form one IOC*/}
      {/* {showFormIoc && ( */}
      <Form className='container mt-2 mb-2'>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <h2 className='text-center mb-4'>
            Ingresar IP
          </h2>
          <Form.Label>Consultar IPs una a una en AbuseIPDB</Form.Label> <br />
          <Form.Label>
            Formatos aceptados:{' '}
            <small>
              <b>IPv4</b>
            </small>
          </Form.Label>
          <Form.Control
            style={{ fontSize: '30px' }}
            as='textarea'
            rows={2}
            value={ip}
            size={'sm'}
            onChange={(e) => setIp(e.target.value)}
            disabled={textareaDisabled}
          />
        </Form.Group>
        <div className='text-center'>
          <Button
            className='mb-3'
            variant='success'
            onClick={() => save(ip)}
            disabled={buttonDisabled || ip === ''}
          >
            Consultar
          </Button>
        </div>
      </Form>
      {/* )} */}

      {/* Form two or more IOCs*/}
      {/* {showFormCsvIoc && (
        <UploadExcelComponent
          onFileSelectSuccess={(file: any) => setIocsCsv(file)}
          readFile={readFile}
        />
      )} */}

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
            ips.length === 0 ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          {/* <ExportExcelComponent ips={ips} /> */}
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
              <th>AbuseConfidenceScore</th>
              <th>Domain</th>
              <th>IpAddress</th>
              <th>Isp</th>
              <th>LastReportedAt</th>
              <th>TotalReports</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><ProgressBar
                  animated
                  variant="warning"
                  label={`${el.abuseConfidenceScore}%`}
                  now={el.abuseConfidenceScore}
                /></td>
                <td>{el.domain}</td>
                <td>{el.ipAddress}</td>
                <td>{el.isp}</td>
                <td>
                  {new Intl.DateTimeFormat("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit"
                  }).format(el.lastReportedAt)}

                </td>
                <td>{el.totalReports}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default IpComponent;

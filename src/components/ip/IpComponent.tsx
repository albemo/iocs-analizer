import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
// import ExportExcelComponent from '../excel/ExportExcelComponent';
// import UploadExcelComponent from '../excel/UploadExcelComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface IipItemAbuseIp {
  abuseConfidenceScore: any;
  domain: any;
  ipAddress: any;
  isp: any;
  lastReportedAt: any;
  totalReports: any;
}
interface IipItemVirusTotal {
  reports: any;
  totalReports: any;
  ipAddress: any;
  malicious: any[];
  // isp: any;
  // lastReportedAt: any;
}

function IpComponent() {
  const [ipsAbuseIp, setIpsAbuseIp] = useState<IipItemAbuseIp[]>([]);
  const [ipsVirusTotal, setIpsVirusTotal] = useState<IipItemVirusTotal[]>([]);
  const [ip, setIp] = useState('');


  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [show, setShow] = useState(false);


  const proxyurl = 'https://cors-anywhere.herokuapp.com/';
  const keyAbuseIpDb = '673b76fb36714c2a41a73b11d30d91b2db2ea4d330e02aa7618a4ceff23e301e30afb0f8ddbb7d45';
  // const keyIbmXForce = '1d5e46f3-c66e-40e5-b88a-f69d7233f513'

  // csv
  // const [iocsCsv, setIocsCsv] = useState([]);
  // show component for only one IOC
  // const [showFormIp, setShowFormIp] = useState(true);
  // show component for only CSV IOC
  // const [showFormCsvIp, setShowFormCsvIp] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    // let ipItems: IipItem[] = [];
    try {
      // setIps(ipItems);
      localStorage.setItem("ipsAbuseIp", JSON.stringify(ipsAbuseIp));
      localStorage.setItem("ipsVirusTotal", JSON.stringify(ipsVirusTotal));

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

  const save = async (ip: string) => {
    const isValidIp = validateIp(ip);
    if (!isValidIp) return;
    setButtonDisabled(true);
    setTextareaDisabled(true);

    try {
      const fetchIpAbuseIp = await axios(
        `${proxyurl}https://api.abuseipdb.com/api/v2/check`,
        {
          // headers: { 'Key': `${process.env.REACT_APP_API_KEY_ABUSEIP}` },
          headers: { 'Key': `${keyAbuseIpDb}` },
          params: {
            'ipAddress': `${ip}`,
            // 'ipAddress': `36.91.140.95`,
          }
        }
      );

      console.log('fetchIpAbuseIp', fetchIpAbuseIp.data.data)

      // Success 🎉
      const item: IipItemAbuseIp = {
        abuseConfidenceScore: fetchIpAbuseIp.data.data.abuseConfidenceScore,
        domain: fetchIpAbuseIp.data.data.domain,
        ipAddress: fetchIpAbuseIp.data.data.ipAddress,
        isp: fetchIpAbuseIp.data.data.isp,
        lastReportedAt: fetchIpAbuseIp.data.data.lastReportedAt,
        totalReports: fetchIpAbuseIp.data.data.totalReports
      };

      item.lastReportedAt = item.lastReportedAt !== null
        ? Date.parse(fetchIpAbuseIp.data.data.lastReportedAt)
        : item.lastReportedAt

      await submitAbuseIp(item);

      // await submit(item);
    } catch (error) {
      // Error 😨
      // console.log('error', error);
    }

    try {
      let fetchIPVirusTotal = await axios(
        `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
        {
          headers: { 'x-apiKey': `${process.env.REACT_APP_API_KEY}` },
        }
      );

      console.log('fetchIPVirusTotal', fetchIPVirusTotal.data)

      let data = fetchIPVirusTotal.data.data
      let data2 = Object.values(data.attributes.last_analysis_results)
      let lastAnalysisStats = data.attributes.last_analysis_stats
      let malicious = data2.filter((x: any) => x.category == 'malicious');

      const item: IipItemVirusTotal = {
        reports: lastAnalysisStats.malicious,
        totalReports: data2.length,
        ipAddress: data.id,
        malicious
      };

      console.log("-----------item------------", item)

      await submitVirusTotalIp(item);
    } catch (error) {

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

  const submitAbuseIp = async (item: IipItemAbuseIp) => {
    let iocItems: IipItemAbuseIp[] = [];
    let iocs: any = JSON.parse(localStorage.getItem("ipsAbuseIp") || '{}'); // await axios.get('http://localhost:3000/api/v1/iocs');
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

    ipsAbuseIp.unshift(item)

    setIpsAbuseIp(ipsAbuseIp);

    await axios
    // .post('http://localhost:3000/api/v1/iocs', item)
    // .then((res) => console.log(res))
    // .catch((err) => console.log(err));

    refresh();
  };

  const submitVirusTotalIp = async (item: IipItemVirusTotal) => {
    let iocItems: IipItemVirusTotal[] = [];
    let iocs: any = JSON.parse(localStorage.getItem("ipsVirusTotal") || '{}'); // await axios.get('http://localhost:3000/api/v1/iocs');
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

    ipsVirusTotal.unshift(item)

    setIpsVirusTotal(ipsVirusTotal);

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
          {/* <Form.Label>Consultar IPs una a una en AbuseIPDB</Form.Label> <br /> */}
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
            ipsAbuseIp.length === 0 ? { pointerEvents: 'none', opacity: '0.4' } : {}
          }
        >
          {/* <ExportExcelComponent ips={ips} /> */}
        </div>
      </div>
      <div
        className='container-fluid table-responsive'
        style={{ fontSize: '14px' }}
      >

        {/* ------------------- AbuseIp-------------- */}

        <h2 className='text-left mb-4'><img src='/lib/abuseipdb-logo.svg' style={{height: '40px'}} />AbuseIPDB</h2>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>IpAddress</th>
              <th>AbuseConfidenceScore</th>
              <th>Domain</th>
              <th>Isp</th>
              <th>LastReportedAt</th>
              <th>TotalReports</th>
            </tr>
          </thead>
          <tbody>
            {ipsAbuseIp.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.ipAddress}</td>
                <td><ProgressBar
                  animated
                  variant="warning"
                  label={`${el.abuseConfidenceScore}%`}
                  now={el.abuseConfidenceScore}
                /></td>
                <td>{el.domain}</td>
                <td>{el.isp}</td>
                <td>
                  {
                    el.lastReportedAt !== null ?
                      new Intl.DateTimeFormat("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                      }).format(el.lastReportedAt) :
                      el.lastReportedAt
                  }

                </td>
                <td>{el.totalReports}</td>
              </tr>
            ))}
          </tbody>
        </Table>


        <h2 className='mb-4'></h2>
        {/* ------------------- Virus Total-------------- */}
        <h2 className='text-left mb-4'><img src='/lib/vt_logo.svg' style={{height: '30px'}} />Virus Total</h2>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>IpAddress</th>
              <th>Security Vendors Flagged this <br /> IP Address as Malicious</th>
              <th>Engine Name</th>
              <th>Category</th>
              {/* <th>LastReportedAt</th>
              <th>TotalReports</th> */}
            </tr>
          </thead>
          <tbody>
            {ipsVirusTotal.map((el, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{el.ipAddress}</td>
                <td>{el.reports}/{el.totalReports}
                </td>
                <td>
                  <Table>
                    <tbody>
                      {el.malicious.map((e, l) => (
                        <tr key={l}>
                          <td>{e.engine_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                <td>
                  <Table>
                    <tbody>
                      {el.malicious.map((e, l) => (
                        <tr key={l}>
                          <td>{e.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                {/* <td></td>
                <td>{el.totalReports}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default IpComponent;



      // var user = 'a3636ba7-6203-4677-a5de-49d380591639';
      // var pass = 'db959be4-3e39-423e-8825-7cc52c58f6ab';

      // var auth = Buffer.from(`${user}:${pass}`).toString('base64')
      // console.log("asdafsdasfdsadfafds", auth)
      // const fetchIpIbmXForce = await axios(
      //   `https://exchange.xforce.ibmcloud.com/api/ipr/${ip}`,
      //   {
      //     headers: {
      //       'Authorization': 'Basic ' + 'MWE2Y2VlZmEtNDVkNC00ZDQ1LTllYmMtNGVhZWQzZjU2OTIxOjNhYmNlMTMzLTdlOTAtNGE4NS1hZWJkLWM4MTA5NDQ2MTk0OA=='
      //     }
      //   }
      // );
      // console.log('fetchIpIbmXForce', fetchIpIbmXForce)
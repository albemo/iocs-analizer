import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import ExportExcelComponent from '../export/ExportExcelComponent'
import AlertDismissibleExample from '../AlertDismissibleExample'

interface IiocItem {
  sha256: any,
  sha_1: any,
  md5: any,
  mcAfee: any,
  engines: any
}

function IocComponent() {
  const [iocs, setIocs] = useState<IiocItem[]>([])
  const [ioc, setIoc] = useState('')
  const [alert, setAlert] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [textareaDisabled, setTextareaDisabled] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [show, setShow] = useState(false);


  useEffect(() => {
    refresh()
  }, [])


  const refresh = () => {
    let iocItems: IiocItem[] = [];
    let iocss = localStorage.getItem('iocs')
    if (typeof iocss === 'string') {
      iocItems = JSON.parse(iocss);
    }
    setIocs(iocItems)
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const clearData = () => {
    handleClose()
    localStorage.clear()
    refresh()
  }


  const save = async (ioc: any) => {
    setAlert(false)
    setButtonDisabled(true)
    setTextareaDisabled(true)
    try {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const fetchIoc = await axios(`${proxyurl}https://www.virustotal.com/api/v3/files/${ioc}`, {
        headers: { 'x-apiKey': `${process.env.REACT_APP_API_KEY}` }
      })
      // Success 🎉
      console.log(fetchIoc);

      const item: IiocItem = {
        sha256: fetchIoc.data.data.attributes.sha256,
        sha_1: fetchIoc.data.data.attributes.sha1,
        md5: fetchIoc.data.data.attributes.md5,
        mcAfee: fetchIoc.data.data.attributes.last_analysis_results.McAfee.result,
        engines: `${fetchIoc.data.data.attributes.last_analysis_stats.malicious} / ${fetchIoc.data.data.attributes.last_analysis_stats.malicious + fetchIoc.data.data.attributes.last_analysis_stats.undetected} `
      }
      setLocalStorage(item)
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
        setErrorMessage(error.response.data.error.message)
        console.log(error.response.data.error.message)
        setAlert(true)
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
    }
    setIoc('')
    setButtonDisabled(false)
    setTextareaDisabled(false)
  }


  const setLocalStorage = (ioc: IiocItem) => {
    const hasLocalStorage = localStorage.length > 0
    if (hasLocalStorage) {
      let iocItems: IiocItem[] = [];
      let iocs = localStorage.getItem('iocs')
      if (typeof iocs === 'string') {
        iocItems = JSON.parse(iocs);
      }
      const filterIocInIocItems = iocItems.filter(x => x.sha256 !== ioc.sha256 && x.md5 !== ioc.md5 && x.sha_1 !== ioc.sha_1)
      filterIocInIocItems.unshift(ioc)
      localStorage.setItem('iocs', JSON.stringify(filterIocInIocItems))
    }
    else {
      let iocs: IiocItem[] = []
      iocs.unshift(ioc)
      localStorage.setItem('iocs', JSON.stringify(iocs))
    }
    refresh()
  }

  return (
    <>
      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>Está seguro que desea eliminar los datos?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={clearData}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Form */}
      <Form className='container mt-5 mb-5'>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <h2 className='text-center mb-5'>Ingresar Indicador de Compromiso</h2>
          <Form.Label>Formatos aceptados: <small><b>SHA256, MD5 & SHA-1</b></small></Form.Label>
          <Form.Control style={{ fontSize: '30px' }} as="textarea" rows={2} value={ioc} size={'sm'} onChange={e => setIoc(e.target.value)} disabled={textareaDisabled} />
        </Form.Group>
        <div className='text-center'>
          <Button className='mb-3' variant="success" onClick={() => save(ioc)} disabled={buttonDisabled || ioc === ''}>Consultar</Button>
          {alert && <AlertDismissibleExample errorMessage={errorMessage} />}
        </div>
      </Form>

      {/* Datatable */}
      <div className='mb-3 mr-3 d-flex justify-content-end'>
        <div>
          <Button variant="danger" onClick={handleShow} disabled={iocs.length === 0} >Limpiar</Button>
        </div>
        <div className='ml-3' style={iocs.length === 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
          <ExportExcelComponent iocs={iocs} />
        </div>
      </div>
      <div className='container-fluid table-responsive' style={{ fontSize: '14px' }}>
        <Table striped bordered hover size="sm">
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
            {
              iocs.map((el, i) =>
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{el.sha256}</td>
                  <td>{el.sha_1}</td>
                  <td>{el.md5}</td>
                  <td>{el.mcAfee}</td>
                  <td>{el.engines}</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default IocComponent
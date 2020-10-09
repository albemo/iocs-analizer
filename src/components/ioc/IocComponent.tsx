import React, { useState, useEffect } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import ExportExcelComponent from '../export/ExportExcelComponent'

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

  useEffect(() => {
    refresh()
  }, [])


  function refresh() {
    let iocItems: IiocItem[] = [];
    let iocss = localStorage.getItem('iocs')
    if (typeof iocss === 'string') {
      iocItems = JSON.parse(iocss);
    }
    setIocs(iocItems)
  }


  const save = async (ioc: any) => {
    try {
      const fetchIoc = await axios(`https://www.virustotal.com/api/v3/files/${ioc}`, {
        // headers: { 'x-apiKey': `${process.env.REACT_APP_API_KEY}` }
        headers: { 'x-apiKey': '31f181995462bee2a105cdfe78e089d81677810ae7669941e438bcdbcea06fab' }
      })
      const item: IiocItem = {
        sha256: fetchIoc.data.data.attributes.sha256,
        sha_1: fetchIoc.data.data.attributes.sha1,
        md5: fetchIoc.data.data.attributes.md5,
        mcAfee: fetchIoc.data.data.attributes.last_analysis_results.McAfee.result,
        engines: `${fetchIoc.data.data.attributes.last_analysis_stats.malicious} / ${fetchIoc.data.data.attributes.last_analysis_stats.malicious + fetchIoc.data.data.attributes.last_analysis_stats.undetected} `
      }
      setLocalStorage(item)

    } catch (error) {
      console.log(error.message)
    }
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
      <Form className='container mt-5 mb-5'>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <h4 className='text-center mb-3'>Ingresar indicadores de compromiso</h4>
          <Form.Label>Formatos aceptados: <small><b>SHA256, MD5 & SHA-1</b></small></Form.Label>
          <Form.Control as="textarea" rows={3} value={ioc} onChange={e => setIoc(e.target.value)} />
        </Form.Group>
        <div className='text-center'>
          <Button variant="success" onClick={() => save(ioc)}>Consultar</Button>
        </div>
      </Form>
      <div className='container-fluid table-responsive' style={{ fontSize: '14px' }}>
        <div className='text-center'>
          <ExportExcelComponent iocs={iocs} />
        </div>
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
                  <td>{i}</td>
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
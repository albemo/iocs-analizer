import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios'

interface IiocItem {
  sha256: any,
  sha_1: any,
  md5: any,
  mcAfee: any,
  total: any
}

function IocForm(setRefreshTable: any) {
  const [ioc, setIoc] = useState('')

  const save = async (ioc: any) => {
    try {
      const fetchIoc = await axios(`https://www.virustotal.com/api/v3/files/${ioc}`, {
        headers: { 'x-apiKey': `${process.env.REACT_APP_API_KEY}` }
      })

      const item: IiocItem = {
        sha256: fetchIoc.data.data.attributes.sha256,
        sha_1: fetchIoc.data.data.attributes.sha1,
        md5: fetchIoc.data.data.attributes.md5,
        mcAfee: fetchIoc.data.data.attributes.last_analysis_results.McAfee.result,
        total: 1
      }

      setLocalStorage(item)
      setRefreshTable(true)

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

      filterIocInIocItems.push(ioc)
      localStorage.setItem('iocs', JSON.stringify(filterIocInIocItems))

    }
    else {
      let iocs: IiocItem[] = []
      iocs.push(ioc)
      localStorage.setItem('iocs', JSON.stringify(iocs))
    }
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
    </>
  )
}

export default IocForm
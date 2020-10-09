/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import IocForm from './IocForm'

interface IiocItem {
  sha256: any,
  sha_1: any,
  md5: any,
  mcAfee: any,
  total: any
}

function IocItems() {
  const [iocs, setIocs] = useState<IiocItem[]>([])

  useEffect(() => {
    refresh()
    console.log('se está refrescando')
  }, [])

  function refresh() {
    let iocItems: IiocItem[] = [];
    let iocss = localStorage.getItem('iocs')
    if (typeof iocss === 'string') {
      iocItems = JSON.parse(iocss);
    }
    setIocs(iocItems)
  }

  const todoItems = iocs.map((el, i) =>
    <tr key={i}>
      <td>{i}</td>
      <td>{el.sha256}</td>
      <td>{el.sha_1}</td>
      <td>{el.md5}</td>
      <td>{el.mcAfee}</td>
      <td>{el.total}</td>
    </tr>
  );


  return (
    <>
      <IocForm />
      <div className='container-fluid'>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>SHA256</th>
              <th>SHA-1</th>
              <th>MD5</th>
              <th>McAfee</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              todoItems
            }
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default IocItems
import React from 'react'
import { CSVLink } from "react-csv";
import { Button } from 'react-bootstrap'

interface IiocItem {
  sha256: any,
  sha1: any,
  md5: any,
  mcAfee: any,
  engines: any
}

function ExportExcelComponent({ iocs }: { iocs: IiocItem[] }) {
  return (
    <>
      <CSVLink style={{ textDecoration: 'none', color: '#fff' }} data={iocs}>
        <Button variant="success">
          Descargar CSV
      </Button>
      </CSVLink>
    </>
  )
}

export default ExportExcelComponent
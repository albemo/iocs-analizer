import React from 'react'
import { CSVLink } from "react-csv";
import { Button } from 'react-bootstrap'

interface IiocItem {
  sha256: any,
  sha_1: any,
  md5: any,
  mcAfee: any,
  engines: any
}

function ExportExcelComponent({ iocs }: { iocs: IiocItem[] }) {
  // const [iocs, setIocs] = useState<IiocItem[]>([])

  // let iocItems: IiocItem[] = [];
  // let iocss = localStorage.getItem('iocs')
  // if (typeof iocss === 'string') {
  //   iocItems = JSON.parse(iocss);
  // }
  // setIocs(iocItems)

  // const csvData = iocs;


  return (
    <>
      <Button variant="success">
        <CSVLink style={{ textDecoration: 'none', color: '#fff' }} data={iocs}>Descargar CSV</CSVLink>
      </Button>
    </>
  )
}

export default ExportExcelComponent
import React, { use, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from "react-redux"
import { selectuploadCSVState } from "../selectors/index.ts"
import { IUploadCSVResponseItem } from '../types/index'

const DataTable = () => {

  const [data, setData] = useState<IUploadCSVResponseItem[]>([])
  const uploadCSVData = useSelector(selectuploadCSVState)

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return
    }
    console.log(uploadCSVData.data)
  }, [uploadCSVData])

  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Text</th>
          <th scope="col">Polarity</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-column">{row.text}</td>
                <td>{row.sentiment}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No records
              </td>
            </tr>
          )}
      </tbody>
    </Table>
  )
}

export default DataTable
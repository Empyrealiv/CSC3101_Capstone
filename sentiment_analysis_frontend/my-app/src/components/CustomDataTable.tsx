import React, { use, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from "react-redux"
import { selectuploadCSVState } from "../selectors/index.ts"
import { IUploadCSVResponseItem } from '../types/index'
import "../assets/Components/index.css";

interface CustomDataTableProps {
  setTextInfo: React.Dispatch<React.SetStateAction<string>>;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  setTextInfo
}) => {
  const [data, setData] = useState<IUploadCSVResponseItem[]>([])
  const uploadCSVData = useSelector(selectuploadCSVState)

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return
    }
    setData(uploadCSVData.data)
  }, [uploadCSVData])

  return (
    <Table bordered hover className='custom-table'>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Text</th>
          <th scope="col">Sentiment</th>
          <th scope="col">Confidence</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} onClick={() => {setTextInfo(row.text)}}>
                <th scope="row">{index + 1}</th>
                <td className="text-column">{row.text}</td>
                <td>{row.sentiment}</td>
                <td>{row.confidence}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No records
              </td>
            </tr>
          )}
      </tbody>
    </Table>
  )
}

export default CustomDataTable
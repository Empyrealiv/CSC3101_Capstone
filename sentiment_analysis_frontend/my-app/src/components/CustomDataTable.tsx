import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useSelector, useDispatch } from "react-redux"
import { selectuploadCSVState } from "../selectors/index.ts"
import { IUploadCSVResponse } from '../types/index'
import { getEmotionMap } from '../pages/functions.ts';
import "../assets/Components/index.css";



const CustomDataTable= () => {
  const [data, setData] = useState<IUploadCSVResponse | null>(null)
  const uploadCSVData = useSelector(selectuploadCSVState)
  const [emotionMap, setEmotionMap] = useState({})
  const [evaluationMode, setEvaluationMode] = useState<boolean>(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return
    }
    setData(uploadCSVData.data)
    setEmotionMap(getEmotionMap(uploadCSVData.data))
    setEvaluationMode(uploadCSVData.data.evaluation_mode)
  }, [uploadCSVData])

  return (
    <Table bordered hover className='custom-table'>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Text</th>
          <th scope="col">Label</th>
          {evaluationMode && <th scope="col">Actual Label</th>}
          <th scope="col">Confidence</th>
        </tr>
      </thead>
      <tbody>
        {data ? (
            data.texts.map((text, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="text-column">{text}</td>
                <td>{emotionMap[data.predicted_classes[index]]}</td>
                {evaluationMode && data.labels && (
                  <td>{emotionMap[data.labels[index]]}</td>
                )}
                <td>{data.confidence_scores[index]}</td>
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
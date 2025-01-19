import React, { useEffect } from "react"
import ReactFileReader from "react-file-reader"
import { Button } from "react-bootstrap"
import Papa from "papaparse"
import sentimentApi from "../api/index.ts"
import { useSelector, useDispatch } from "react-redux"
import { selectMultiPredictState } from "../selectors/index.ts"
import { multiPredictRequest } from "../actions/index.ts"

const UploadCSVButton = () => {
  const dispatch = useDispatch()

  const handleFiles = (files) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        if (csvText) {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
              const textArray = result.data.map((row: any) => {
                const text = Object.keys(row)[0]
                return row[text]
              })
              dispatch(multiPredictRequest(textArray))
            },
            error: (error) => {
            alert("Error parsing CSV:" + error);
            },
          })
        }
      }
      reader.onerror = () => {
        alert("Failed to read the file.")
      }

      reader.readAsText(files[0]);
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <ReactFileReader handleFiles={handleFiles} fileTypes={".csv"}>
      <Button variant="primary">Upload</Button>
    </ReactFileReader>
  )
}

export default UploadCSVButton;

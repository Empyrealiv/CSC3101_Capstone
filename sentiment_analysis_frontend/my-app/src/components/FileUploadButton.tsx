import React, { useEffect } from "react"
import ReactFileReader from "react-file-reader"
import { Button } from "react-bootstrap"
import Papa from "papaparse"
import sentimentApi from "../api/index.ts"
import { useSelector, useDispatch } from "react-redux"
import { selectMultiPredictState } from "../selectors/index.ts"
import { multiPredictRequest } from "../actions/index.ts"
import { PREDICTED_STATES } from "../pages/Dashboard/constants.ts"

interface FileUploadButtonProps {
  selectedModel: string
  setPredictedState: React.Dispatch<React.SetStateAction<string>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UploadCSVButton: React.FC<FileUploadButtonProps> = ({ selectedModel, setPredictedState, setLoading }) => {
  const dispatch = useDispatch()

  const preparePayload = (textArray: string[], selectedModel: string) => {
    const payload = {
      texts: textArray,
      model_name: selectedModel
    }
    return payload
  }

  const handleFiles = (files) => {
    setPredictedState(PREDICTED_STATES.multi)
    try {
      setLoading(true)
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
              const payload = preparePayload(textArray, selectedModel)
              dispatch(multiPredictRequest(payload))
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <ReactFileReader handleFiles={handleFiles} fileTypes={".csv"}>
      <Button variant="primary">Upload</Button>
    </ReactFileReader>
  )
}

export default UploadCSVButton;

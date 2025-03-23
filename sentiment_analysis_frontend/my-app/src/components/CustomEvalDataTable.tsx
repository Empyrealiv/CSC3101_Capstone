import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "../assets/Components/index.css";
import { useDispatch, useSelector } from "react-redux";
import { selectuploadCSVState } from "../selectors/index.ts";
import { addToast } from "../actions/index.ts";
import { IMetrics } from "../types/index.ts";
import { ERROR_MESSAGE } from "../pages/constants.ts";

const CustomEvalDataTable = () => {
  const [data, setData] = useState<IMetrics | null>(null);
  const uploadCSVData = useSelector(selectuploadCSVState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return;
    }
    try {
      if (uploadCSVData.data.evaluation_mode && uploadCSVData.data.metrics) {
        setData(uploadCSVData.data.metrics);
      } else {
        setData(null);
      }
    } catch (error: any) {
      dispatch(addToast(ERROR_MESSAGE.E01));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadCSVData]);
  return (
    <Table bordered hover className="custom-table">
      <thead>
        <tr>
          <th scope="col">Accuracy</th>
          <th scope="col">F1</th>
          <th scope="col">Precision</th>
          <th scope="col">Recall</th>
        </tr>
      </thead>
      <tbody>
        {data ? (
          <tr className="green-row">
            <td>{data.accuracy}</td>
            <td>{data.f1}</td>
            <td>{data.precision}</td>
            <td>{data.recall}</td>
          </tr>
        ) : (
          <tr>
            <td colSpan={4} className="text-center">
              No records
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CustomEvalDataTable;

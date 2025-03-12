import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { selectuploadCSVState } from "../selectors/index.ts";
import { createChartData } from "../pages/functions.ts";
import { addToast } from "../actions/index.ts";
import "../assets/Components/index.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"];

const Customchart = () => {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const uploadCSVData = useSelector(selectuploadCSVState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return;
    }
    try {
      setPieData(createChartData(uploadCSVData.data));
    } catch (error) {
      dispatch(addToast(error.message));
    }
    setPieData(createChartData(uploadCSVData.data));
  }, [uploadCSVData]);

  return (
    <div className="pie-chart-container">
        {pieData.length > 0 ? (
        <PieChart width={window.innerWidth * 0.2} height={window.innerWidth * 0.18} className="pie-chart">
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={window.innerWidth * 0.06}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div>
          <p>No data available</p>
        </div>
      )}
    </div>
  )
};

export default Customchart;

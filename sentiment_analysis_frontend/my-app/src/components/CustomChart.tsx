import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { selectuploadCSVState } from "../selectors/index.ts";
import { IUploadCSVResponseItem } from "../types/index";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Customchart = () => {
  const [data, setData] = useState<IUploadCSVResponseItem[]>([]);
  const uploadCSVData = useSelector(selectuploadCSVState);

  // useEffect(() => {
  //   if (uploadCSVData.isLoading) {
  //     return;
  //   }
  //   setData(uploadCSVData.data.results);
  // }, [uploadCSVData]);

  const pieData = [
    {
      name: "Positive",
      value: data.filter((item) => item.sentiment === "Positive").length,
    },
    {
      name: "Negative",
      value: data.filter((item) => item.sentiment === "Negative").length,
    },
  ];

  return data.length > 0 ? (
    <PieChart width={window.innerWidth * 0.2} height={window.innerWidth * 0.18}>
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
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <p>No data available</p>
    </div>
  );
};

export default Customchart;

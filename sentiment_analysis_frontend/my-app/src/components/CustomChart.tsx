import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { selectuploadCSVState } from "../selectors/index.ts";
import { createChartData } from "../pages/functions.ts";
import { addToast } from "../actions/index.ts";
import { ERROR_MESSAGE } from "../pages/constants.ts";
import "../assets/Components/index.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
];

interface CustomChartProps {
  pieEvaluationMode: boolean;
  setDisableEvalButton: React.Dispatch<React.SetStateAction<boolean>>;
  setPieEvaluationMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Customchart: React.FC<CustomChartProps> = ({
  pieEvaluationMode,
  setDisableEvalButton,
  setPieEvaluationMode,
}) => {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [evalPieData, setEvalPieData] = useState<
    { name: string; value: number }[]
  >([]);
  const uploadCSVData = useSelector(selectuploadCSVState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (uploadCSVData.isLoading) {
      return;
    }
    try {
      setDisableEvalButton(true);
      setPieEvaluationMode(false);
      setPieData(
        createChartData(
          uploadCSVData.data.mode,
          uploadCSVData.data.predicted_classes
        )
      );
      if (uploadCSVData.data.evaluation_mode) {
        setEvalPieData(
          createChartData(uploadCSVData.data.mode, uploadCSVData.data.labels)
        );
        setDisableEvalButton(false);
      }
    } catch (error: any) {
      dispatch(addToast(ERROR_MESSAGE.E01));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadCSVData]);

  const showPieData = (
    title: string,
    data: { name: string; value: number }[]
  ) => {
    return (
      <div>
        {data.length > 0 ? (
          <div>
            <p>{title}</p>
            <PieChart
              width={window.innerWidth * 0.2}
              height={window.innerWidth * 0.18}
              className="pie-chart"
            >
              <Pie
                data={data.filter((entry) => entry.value > 0)}
                cx="50%"
                cy="50%"
                outerRadius={window.innerWidth * 0.06}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data
                  .filter((entry) => entry.value > 0)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        ) : (
          <div>
            <p>No data available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pie-chart-container">
      {pieEvaluationMode
        ? showPieData("Actual Pie Chart", evalPieData)
        : showPieData("Predicted Pie Chart", pieData)}
    </div>
  );
};

export default Customchart;

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Chart from './Chart.js';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SentimentChart = ({ inputData }) => {

    const pieData = [
        { name: 'Positive', value: inputData.filter((item) => item.polarity === 'Positive').length },
        { name: 'Negative', value: inputData.filter((item) => item.polarity === 'Negative').length },
    ];

    return (
        <PieChart width={window.innerWidth * 0.2} height={window.innerWidth * 0.2}>
        <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={window.innerWidth * 0.075}
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
    );
};

export default SentimentChart;
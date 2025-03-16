import React, {  } from 'react';
import Table from 'react-bootstrap/Table';
import "../assets/Components/index.css";

const CustomEvalDataTable = () => {
  return (
    <Table bordered hover className='custom-table'>
      <thead>
        <tr>
          <th scope="col">Accuracy</th>
          <th scope="col">F1</th>
          <th scope="col">Precision</th>
          <th scope="col">Recall</th>
        </tr>
      </thead>
      <tbody>
        <tr className='green-row'>
          <td>99%</td>
          <td>99%</td>
          <td>99%</td>
          <td>99%</td>
        </tr>
      </tbody>
    </Table>
  )
}

export default CustomEvalDataTable
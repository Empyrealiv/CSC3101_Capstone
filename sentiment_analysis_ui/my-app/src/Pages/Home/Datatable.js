import React from 'react';

const DataTable = ({ data, onRowClick }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Text</th>
          <th scope="col">Polarity</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} onClick={() => onRowClick(row.text)} style={{ cursor: 'pointer' }}>
            <th scope="row">{index + 1}</th>
            <td className="text-column">{row.text}</td>
            <td>{row.polarity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
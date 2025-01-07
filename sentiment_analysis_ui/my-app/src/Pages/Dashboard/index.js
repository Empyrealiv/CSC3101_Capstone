import React from 'react';
import { useState } from 'react';
import DataTable from './Datatable.js';
import SentimentChart from './Chart.js';
import '../../css/Dashboard/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const testData = [
    { text: 'I love React!', polarity: 'Positive' },
    { text: 'This is amazing!', polarity: 'Positive' },
    { text: 'Fantastic work!', polarity: 'Positive' },
    { text: 'I hate bugs!', polarity: 'Negative' },
    { text: 'This is frustratinggggggggggggggggggggggggggggggg.', polarity: 'Negative' },
    { text: 'I love React!', polarity: 'Positive' },
    { text: 'This is amazing!', polarity: 'Positive' },
    { text: 'Fantastic work!', polarity: 'Positive' },
    { text: 'I hate bugs!', polarity: 'Negative' },
    { text: 'This is frustrating.', polarity: 'Negative' },
  ];

export const Dashboard = () => {

    const [data, setData] = useState(testData);
    const [inputValue, setInputValue] = useState('');
    const [selectedText, setSelectedText] = useState('');

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleRowClick = (text) => {
        setSelectedText(text);
    };

    return (
        <div>
            <div className="container">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <div className='pie-chart-container'>
                                <SentimentChart inputData={data} />
                            </div>
                        </div>
                        <br></br>
                        <div className="col table-col">
                            <div className='table-container'>
                                <div className='table-box'>
                                    <DataTable data={data} onRowClick={handleRowClick} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className='text-container'>
                                <div className="text-box">
                                    {selectedText || 'Click on a row to display its text here.'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="input-container">
                                <textarea
                                type="text"
                                className="form-control"
                                placeholder="Enter text here..."
                                value={inputValue}
                                onChange={handleInputChange}
                                />
                                <button
                                className="btn btn-primary"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    bottom: '10px',
                                    resize: 'none',
                                    boxSizing: 'border-box',
                                }}
                                >
                                    <FontAwesomeIcon icon={faUpload} />
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}
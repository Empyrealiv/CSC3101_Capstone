import React from 'react';
import { useState } from 'react';
import DataTable from './Datatable.js';
import SentimentChart from './Chart.js';
import UploadCSVButton from '../Components/UploadCSVButton.js';
import '../../css/Home/index.css';

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

const Home = () => {

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
    <div className='home-container'> 
        <div className='content-container'>
            <div className="container">
                <div className="row">
                    <div className='d-flex justify-content-center'>
                        <div className="col-md-auto">
                            <div className="pie-chart-container">
                                <SentimentChart inputData={data} />
                            </div>
                        </div>
                        <div className="col-md-auto table-col">
                            <div className="table-container">
                                <div className="table-box">
                                    <DataTable data={data} onRowClick={handleRowClick} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="text-container">
                            <div className="text-box">
                                {selectedText || 'Click on a row to display its text here.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-light p-3 border-top">
            <div className="input-container">
                <div className="row">
                    <div className="col">
                        <textarea
                            className="form-control mb-3"
                            placeholder="Enter text here..."
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary me-2">Predict</button>
                        <UploadCSVButton />
                    </div>
                </div>
            </div>
        </div>
    </div>

    )
}

export default Home;
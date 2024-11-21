'use client';

import { useState } from 'react';

export default function Home() {
    const [inputValue, setInputValue] = useState('');
    const [sentiment, setSentiment] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleButtonClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputValue }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            alert('The text is '+data.sentiment);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send data to the API');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <div style={{ padding: '20px' }}>
                <h1 style={{ padding: '20px' }}>Sentiment Analysis</h1>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter text here"
                    style={{
                        padding: '8px',
                        fontSize: '16px',
                        height: '30vh',
                        width: '100%',             
                        verticalAlign: 'top',       
                        resize: 'none'              
                    }}
                />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button
                    onClick={handleButtonClick}
                    style={{
                        padding: '8px 12px',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    Submit
                </button>
            </div>
            {sentiment && (
                <div style={{ marginTop: '20px', fontSize: '18px' }}>
                    <p>Sentiment: {sentiment}</p>
                </div>
            )}
            </div>
        </div>
    );
}

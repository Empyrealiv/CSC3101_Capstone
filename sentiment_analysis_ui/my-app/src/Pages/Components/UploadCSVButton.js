import React from "react";
import ReactFileReader from "react-file-reader";
import '../../css/Components/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const UploadCSVButton = () => {
    const handleFiles = (files) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            console.log(csvData);
        };
        reader.readAsText(files[0]);
    };

    return (
        <ReactFileReader handleFiles={handleFiles} fileTypes={".csv"}>
            <button className="btn btn-primary">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </ReactFileReader>
    );
};

export default UploadCSVButton;
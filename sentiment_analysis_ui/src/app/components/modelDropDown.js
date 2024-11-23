import React, { useEffect, useState } from "react";

const ModelDropDown = () => {
  const [dropdownData, setDropdownData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/getModels/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        setDropdownData(data.models || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    console.log("Selected:", event.target.value);
  };

  return (
    <div>
      <select id="dropdown" value={selectedOption} onChange={handleChange}>
      <option value="">-- Select a model --</option>
        {dropdownData.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelDropDown;

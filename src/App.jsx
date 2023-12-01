import React, { useState } from 'react';
import './App.css';
import brain from './assets/brain.png'

const App = () => {
  const [formData, setFormData] = useState({
    'M/F': '',
    'Age': '',  
    'EDUC': '',
    'SES': '',
    'MMSE': '',
    'eTIV': '',
    'nWBV': '',
    'ASF': '',
  });

  const END_POINT = "https://dementia-api.onrender.com/predict"
  const [predictionResult, setPredictionResult] = useState(null);
  const [colorImage, setColorImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Convert input values to numeric types
    const numericFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, Number(value)])
    );

    const response = await fetch(END_POINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(numericFormData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    setPredictionResult(result);
     setColorImage(result.probability > 0.5);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

 const imageStyle = {
    marginLeft: '20px',
    width: '600px',
    height: '500px',
    filter: colorImage ? 'none' : 'grayscale(100%)',
    borderRadius: '5px',
  };

  const textStyle = {
    color: colorImage ? "red" : "green",
  }

  return (
    <div className="prediction-container">
      <div className="prediction-form-container">
        <h2>AI based Alzheimer's Prediction </h2>
        <form className="prediction-form" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div className="input-container" key={key}>
              <label htmlFor={key}>{key}:</label>
              <input
                type="text"
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Predict</button>
        </form>

        
      </div>

      <div className={`image-container`}>
      
        <img
          src={brain}
          alt="Prediction Result"
          style={imageStyle} 
        />
        {predictionResult && (
          <div className="result">
            
            {/*<p>Prediction: {predictionResult.prediction}</p>*/}
            <p>Probability of developing Alzheimer's : <span style={textStyle}> {(predictionResult.probability * 100).toFixed(2)}%</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

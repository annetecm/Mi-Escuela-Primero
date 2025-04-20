import React, { useState } from 'react';
import '../styles/TableSelect.css';

export default function TableSelect({ 
  needs = [], 
  title = "Categorías de necesidades", 
  selectedNeeds = [], 
  onChange = () => {} 
}) {

  //const [selectedNeeds, setSelectedNeeds] = useState([]);

  const handleCheckboxChange = (need) => {
    const isSelected = selectedNeeds.includes(need);
    const updated = isSelected
      ? selectedNeeds.filter((n)=> n !== need)
      : [...selectedNeeds, need];
      onChange(updated); // call the onChange prop with the updated selected needs
    /*/setSelectedNeeds((prevSelected) =>
      prevSelected.includes(need)
        ? prevSelected.filter((t) => t !== need)
        : [...prevSelected, need]
    );/*/
  };

  return (
    <div className="table-select-container">
      <h3>{title}</h3>
      <table className="table-select">
        <thead>
          <tr>
            <th>Necesidades</th>
            <th>Selecciona</th>
          </tr>
        </thead>
        <tbody>
          {needs.map((need, index) => (
            <tr key={index}>
              <td>{need}</td>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedNeeds.includes(need)}
                  onChange={() => handleCheckboxChange(need)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

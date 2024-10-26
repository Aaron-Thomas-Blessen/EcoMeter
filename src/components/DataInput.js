import React, { useState } from "react";

const DataInput = ({ addNewData }) => {
  const [date, setDate] = useState("");
  const [total_load, setTotalLoad] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewData({ date, total_load: Number(total_load), price: Number(price) });
    setDate("");
    setTotalLoad("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Data</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={total_load}
        onChange={(e) => setTotalLoad(e.target.value)}
        placeholder="Total Load"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        required
      />
      <button type="submit">Add Data</button>
    </form>
  );
};

export default DataInput;

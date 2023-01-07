import "./records.css";
import React from "react";
import axios from "axios";

function Records(props) {
  const current = new Date();

  const currTime =
    current.getHours() +
    ":" +
    current.getMinutes() +
    ":" +
    current.getSeconds();

  const checkOut = async (data) => {
      let postData = {
        ...data,
        checkOutTime: currTime,
      };
      await axios.put(`http://localhost:8800/student/${data?.id}`, postData);
      props.function();
  };

  return (
    <>
      <div className="content">
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Date</th>
              <th>CheckIn</th>
              <th>CheckOut</th>
            </tr>
          </thead>
          <tbody>
            {props.details.map((item) => (
              <tr key={item.rollNo}>
                <td>{item.sName}</td>
                <td>{item.rollNo}</td>
                <td>{item?.date}</td>
                <td>{item?.checkInTime}</td>
                {item.checkIn===true ?
                <td>{item?.checkOutTime === "" ? <button onClick={() => {checkOut(item)}}>Check Out</button> : item?.checkOutTime}</td> : 
                <td></td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Records;

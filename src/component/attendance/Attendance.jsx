import "./attendance.css";
import React from "react";
import { useState, useEffect } from "react";
import Records from "../records/Records";
import axios from "axios";

function Attendance() {
  const current = new Date();

  const [time, setTime] = useState("");
  const [data, setData] = useState("");
  const [value, setValue] = useState([]);
  const [error, setError] = useState("");
  const [rollData, setRollData] = useState("");
  const [total, setTotal] = useState(0);

  const [details, setDetails] = useState([]);

  const fetchDetails = async () => {
    const res = await axios.get("http://localhost:8800/student");
    const result = res.data;
    setDetails(result);
    const d = result.reduce((item, current) => {
      if (current?.checkIn === true) {
        item = item + 1;
      }
      return item;
    }, 0);
    setTotal(d);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const currTime =
    current.getHours() +
    ":" +
    current.getMinutes() +
    ":" +
    current.getSeconds();

  const changeValue = (e) => {
    setData(e.target.value);
  };

  const changeRoll = (e) => {
    setRollData(e.target.value);
  };

  const currentDate = new Date();
  const date = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;

  const checkIn = async () => {
    let postData = {
      rollNo: value[0]?.rollNo,
      sName: value[0]?.sName,
      checkIn: true,
      date: date,
      checkInTime: time,
      checkOutTime: "",
    };
    if (value?.length > 0) {
      await axios.put(
        `http://localhost:8800/student/${value[0]?.id}`,
        postData
      );
      fetchDetails();
      setData("");
      setRollData("");
      setError("");
    } else {
      setError("No Data Found");
    }
  };

  const reset = async () => {
    details.map((item, index) => {
      let postData = {
        rollNo: item?.rollNo,
        sName: item?.sName,
        checkIn: false,
        date: "",
        checkInTime: "",
        checkOutTime: "",
      };
      axios.put(`http://localhost:8800/student/${item.id}`, postData);
      console.log(item);
      console.log(index);
    });
    fetchDetails();
  };

  // console.log(value);

  useEffect(() => {
    let temp;
    temp = details.filter((item) => {
      if (item.sName === data && item.rollNo === parseInt(rollData)) {
        return true;
      }
      return false;
    });
    setValue(temp);
    setTime(currTime);
  }, [data, rollData]);

  return (
    <>
      <div className="container">
        <h1>Attendance Form</h1>
        <div className="form">
          <div className="stdName">
            <label htmlFor="name">Name</label>
            <br />
            <input
              type="text"
              id="name"
              placeholder="Enter the Name"
              value={data}
              onChange={changeValue}
            />
          </div>
          <div className="stdRoll">
            <label htmlFor="roll">Roll No</label>
            <br />
            <input
              type="number"
              id="roll"
              placeholder="Enter the Roll Number"
              value={rollData}
              onChange={changeRoll}
            />
          </div>
          <div className="mark">
            <button onClick={checkIn}>CheckIn</button>
            <button onClick={reset}>reset</button>
          </div>
        </div>
        {error ? (
          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        ) : (
          <></>
        )}
        <p>{`Total Students present in the School = ${total}`}</p>
      </div>
      <Records details={details} function={fetchDetails} />
    </>
  );
}
export default Attendance;

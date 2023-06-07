import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const [agency, setAgency] = useState("");
  const [destination, setDestination] = useState("");
  const [line, setLine] = useState("");
  const [tracks, setTracks] = useState("");
  const [direction, setDirection] = useState("");
  const [stops, setStops] = useState([{ id: "stop1", value: "" }]);
  const [lastStop, setLastStop] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Data"));
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmitCode = (e) => {
    e.preventDefault();

    console.log("Agency:", agency);
    console.log("Destination:", destination);
    console.log("Line:", line);
    console.log("Tracks:", tracks);
    console.log("Direction:", direction);
    stops.forEach((stop) => {
      console.log(
        `${stop.id.charAt(0).toUpperCase() + stop.id.slice(1)}:`,
        stop.value
      );
    });
    console.log("Last Stop:", lastStop);
  };

  const handleAddStop = () => {
    const newStopId = `stop${stops.length + 1}`;
    setStops([...stops, { id: newStopId, value: "" }]);
  };

  const handleRemoveStop = (stopId) => {
    const updatedStops = stops.filter((stop) => stop.id !== stopId);
    setStops(updatedStops);
  };

  const handleStopChange = (e, stopId) => {
    const updatedStops = stops.map((stop) =>
      stop.id === stopId ? { ...stop, value: e.target.value } : stop
    );
    setStops(updatedStops);
  };

  return (
    <>
      <div className="center">
        <form className="form" onSubmit={handleSubmitCode}>
          <div className="select-container">
            <label htmlFor="agency">Agency:</label>
            <select
              id="agency"
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              name="agency"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Agency"].map((option, index) => (
                    <option key={`agency_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="destination">Destination:</label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              name="destination"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Destination"].map((option, index) => (
                    <option key={`destination_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="line">Line:</label>
            <select
              id="line"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              name="line"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Line"].map((option, index) => (
                    <option key={`line_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="tracks">Tracks:</label>
            <select
              id="tracks"
              value={tracks}
              onChange={(e) => setTracks(e.target.value)}
              name="tracks"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Tracks"].map((option, index) => (
                    <option key={`tracks_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          <div className="select-container">
            <label htmlFor="direction">Direction:</label>
            <select
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              name="direction"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Direction"].map((option, index) => (
                    <option key={`direction_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          {stops.map((stop) => (
            <div className="select-container" key={stop.id}>
              <label htmlFor={stop.id}>{`${
                stop.id === "stop1" ? "First" : "Stop " + stop.id.slice(4)
              }`}</label>
              <select
                id={stop.id}
                value={stop.value}
                onChange={(e) => handleStopChange(e, stop.id)}
                name={stop.id}
                required
              >
                <option value="">Select an option</option>
                {data.length > 0 &&
                  data.map((item) =>
                    item["Stop"].map((option, index) => (
                      <option key={`stop_${index}`} value={option}>
                        {option}
                      </option>
                    ))
                  )}
              </select>
              {stop.id !== "stop1" && (
                <button type="button" onClick={() => handleRemoveStop(stop.id)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="select-container">
            <label htmlFor="lastStop">Last Stop:</label>
            <select
              id="lastStop"
              value={lastStop}
              onChange={(e) => setLastStop(e.target.value)}
              name="lastStop"
              required
            >
              <option value="">Select an option</option>
              {data.length > 0 &&
                data.map((item) =>
                  item["Stop"].map((option, index) => (
                    <option key={`stop_${index}`} value={option}>
                      {option}
                    </option>
                  ))
                )}
            </select>
          </div>

          <button type="button" onClick={handleAddStop}>
            Add Stop
          </button>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;

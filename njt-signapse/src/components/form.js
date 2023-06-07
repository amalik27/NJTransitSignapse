import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

function App() {
  const [agency, setAgency] = useState("");
  const [destination, setDestination] = useState("");
  const [line, setLine] = useState("");
  const [tracks, setTracks] = useState("");
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

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;

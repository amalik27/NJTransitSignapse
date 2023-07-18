import React, { useState, useRef, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import "./styles.css";
import "./combined.css";
import axios from "axios";

function App() {
  const [destination, setDestination] = useState("");
  const [line, setLine] = useState("");
  const [tracks, setTracks] = useState("");
  const [data, setData] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [messageType, setMessageType] = useState("");
  const [militaryTime, setMilitaryTime] = useState("");

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

  const sendPostRequest = async () => {
    try {
      const downloadLink = await postRequest();
      console.log("videoUrl");
      console.log(downloadLink);
      if (downloadLink) {
        setVideoUrl(downloadLink);
      } else {
        // Retry after a delay
        setTimeout(sendPostRequest, 2000);
      }
    } catch (error) {
      // Handle the error
    }
  };

  const postRequest = async () => {
    // Authentication Request
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);

    const authHeaders = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${encodedCredentials}`,
    };

    const authData = new URLSearchParams();
    authData.append("grant_type", "client_credentials");

    try {
      const authResponse = await axios.post(
        "https://sign-stag.auth.eu-west-2.amazoncognito.com/oauth2/token",
        authData,
        { headers: authHeaders }
      );
      const accessToken = authResponse.data.access_token;

      // Train Announcement Request
      const requestData = {
        timing: militaryTime,
        destination: destination,
        signLanguageType: "ASL",
        messageType: messageType,
        line: line,
        platform: tracks,
        metaData: {
          messageId:
            "messageId here -  record of the request id of the client system",
          tenantId: "tenantId here - client which system",
          userRequestingId:
            "userRequestingId here - person who made the request",
          requestTime: "requestTime here - request time from the client side",
        },
        updatedPlatform: "1",
      };

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "https://sign.client.api.stag.signapsesolutions.com/v1/sign-requests/train-announcements",
        requestData,
        { headers }
      );

      console.log(response.data);
      console.log(response.data.data.downloadLink);

      const downloadLink = response.data.data.downloadLink;
      return downloadLink;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const mm = `${hours.padStart(2, "0")}${minutes.padStart(2, "0")}`;
    setMilitaryTime(mm);
  }, [hours, minutes]);

  const handleSubmitCode = async (e) => {
    e.preventDefault();

    setError(null);
    setShowForm(false); // Hide the form

    // Add code here
    const mm = `${hours.padStart(2, "0")}${minutes.padStart(2, "0")}`;

    setMilitaryTime(mm);

    console.log(militaryTime);
    console.log(destination);
    console.log(messageType);
    console.log(line);
    console.log(tracks);

    try {
      await sendPostRequest();
    } catch (error) {
      // Handle the error
    }
  };

  const handleGoBack = () => {
    setShowForm(true); // Show the form again
  };

  return (
    <>
      {showForm ? (
        <div className="center">
          <p>
            Enter the required fields below and press the "Speak" button to
            generate the text and an audio output.
          </p>
          <form className="form" onSubmit={handleSubmitCode}>
            <div className="select-container">
              <label htmlFor="tracks">Track:</label>
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
              <label htmlFor="hours">Hours:</label>
              <select
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                name="hours"
                required
              >
                <option value="">Select an option</option>
                {Array.from(Array(24).keys()).map((hour) => (
                  <option key={`hour_${hour}`} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-container">
              <label htmlFor="minutes">Minutes:</label>
              <select
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                name="minutes"
                required
              >
                <option value="">Select an option</option>
                {Array.from(Array(60).keys()).map((minute) => (
                  <option
                    key={`minute_${minute}`}
                    value={minute.toString().padStart(2, "0")}
                  >
                    {minute.toString().padStart(2, "0")}
                  </option>
                ))}
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
              <label htmlFor="arrival-departure">Arrival/Departure:</label>
              <select
                id="arrival-departure"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                name="arrival-departure"
                required
              >
                <option value="">Select an option</option>
                <option value="arrival">Arrival</option>
                <option value="departure">Departure</option>
              </select>
            </div>
            <button className="button" type="submit">
              Speak
            </button>
          </form>

          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="center">
          {videoUrl && (
            <video src={videoUrl} controls autoPlay className="fit-video" />
          )}

          <button className={`nav-button`} onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      )}
    </>
  );
}

export default App;

import React, { useState, useRef, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import "./styles.css";
import Speech from "./speech";

function App() {
  const [agency, setAgency] = useState("");
  const [destination, setDestination] = useState("");
  const [line, setLine] = useState("");
  const [tracks, setTracks] = useState("");
  const [direction, setDirection] = useState("");
  const [stops, setStops] = useState([]);
  const [lastStop, setLastStop] = useState("");
  const [data, setData] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [result, setResult] = useState("");
  const [text, setText] = useState(result);
  const [audioFile, setAudioFile] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [voiceName, setVoiceName] = useState("en-US-Wavenet-I");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const audioRef = useRef();

  useEffect(() => {
    setText(result);
  }, [result]);

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

  const generateAudio = async (message) => {
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${process.env.REACT_APP_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: { text: message },
            voice: {
              languageCode: "en-US",
              name: "en-US-Wavenet-F",
              ssmlGender: "FEMALE",
            },
            audioConfig: { audioEncoding: "MP3" },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      const audioFile = `data:audio/mpeg;base64,${data.audioContent}`;
      setAudioFile(audioFile);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();

    // console.log("Agency:", agency);
    // console.log("Destination:", destination);
    // console.log("Line:", line);
    // console.log("Tracks:", tracks);
    // console.log("Direction:", direction);
    stops.forEach((stop) => {
      console.log(
        `${stop.id.charAt(0).toUpperCase() + stop.id.slice(1)}:`,
        stop.value
      );
    });
    // console.log("Last Stop:", lastStop);
    // console.log("Hours:", hours);
    // console.log("Minutes:", minutes);

    const stopsText = stops
      .map((stop) => stop.value)
      .filter((value) => value.trim() !== ""); // Filter out empty stops
    let message = `Attention, Newark Penn Station passengers. Now boarding on track ${tracks} is the ${hours}:${minutes}, ${direction}, ${agency}, ${line} train to ${destination}`;

    if (stopsText.length > 0) {
      const stopsWithCommas = stopsText.join(", "); // Add comma between each stop
      message += ` stopping at ${stopsWithCommas} and ${lastStop}`;
    } else {
      message += ` stopping at ${lastStop}`;
    }

    message += ". Please watch the gap when boarding the train.";

    setGeneratedMessage(message);
    setResult(message);

    setError(null);
    setAudioFile(null);
    setLoading(true);
    setShowForm(false); // Hide the form

    await generateAudio(message);
  };

  const handleGoBack = () => {
    setShowForm(true); // Show the form again
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

  const handlePlayAudio = () => {
    audioRef.current.play();
  };

  const handleStopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (audioFile) {
      audioRef.current.play();
    }
  }, [audioFile]);

  return (
    <>
      {showForm ? (
        <div className="center">
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

            {stops.map((stop, index) => (
              <div className="select-container" key={stop.id}>
                <label htmlFor={stop.id}>{`Stop ${index + 1}`}</label>
                <select
                  id={stop.id}
                  value={stop.value}
                  onChange={(e) => handleStopChange(e, stop.id)}
                  name={stop.id}
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
                <button type="button" onClick={() => handleRemoveStop(stop.id)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={handleAddStop}>
              Add Stop
            </button>

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

            <button type="submit">Speak</button>
          </form>

          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div className="center">
          <div className="message">{generatedMessage}</div>
          {audioFile && (
            <div>
              <audio
                src={audioFile}
                ref={audioRef}
                controls
                onEnded={handleStopAudio} // Stop audio when it finishes playing
              />
              <button onClick={handlePlayAudio}>Play Audio</button>
              <button onClick={handleStopAudio}>Stop Audio</button>
            </div>
          )}
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      )}
    </>
  );
}

export default App;

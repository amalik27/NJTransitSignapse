import React, { useState, useRef } from "react";

function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [voiceName, setVoiceName] = useState("en-US-Wavenet-I");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef();

  // console.log(process.env.REACT_APP_API_KEY);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAudioFile(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "en-US",
              name: voiceName,
              ssmlGender: "FEMALE",
            },
            audioConfig: { audioEncoding: "MP3" },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate audio");
      }

      const audioFile = `data:audio/mpeg;base64,${data.audioContent}`;
      setAudioFile(audioFile);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const voiceOptions = [
    { name: "en-US-Wavenet-A", label: "Voice A" },
    { name: "en-US-Wavenet-B", label: "Voice B" },
    { name: "en-US-Wavenet-C", label: "Voice C" },
    { name: "en-US-Wavenet-D", label: "Voice D" },
    { name: "en-US-Wavenet-E", label: "Voice E" },
    { name: "en-US-Wavenet-F", label: "Voice F" },
    { name: "en-US-Wavenet-G", label: "Voice G" },
    { name: "en-US-Wavenet-H", label: "Voice H" },
    { name: "en-US-Wavenet-I", label: "Voice I" },
    { name: "en-US-Wavenet-J", label: "Voice J" },
  ];

  return (
    <div className="container">
      <h1>Text to Speech</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">Text</label>
          <textarea
            className="form-control"
            rows="3"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="voiceName">Voice</label>
          <select
            className="form-control"
            id="voiceName"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
          >
            {voiceOptions.map((option) => (
              <option key={option.name} value={option.name}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="apiKey">Google API key</label>
          <input
            type="text"
            className="form-control"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {audioFile && (
        <div>
          <audio
            src={audioFile}
            ref={audioRef}
            controls
            onEnded={() => audioRef.current.load()}
          />
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default TextToSpeech;

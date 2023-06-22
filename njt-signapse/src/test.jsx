import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoPage = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const postRequest = () => {
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

    return axios
      .post(
        "https://sign-stag.auth.eu-west-2.amazoncognito.com/oauth2/token",
        authData,
        { headers: authHeaders }
      )
      .then((authResponse) => {
        const accessToken = authResponse.data.access_token;

        // Train Announcement Request code...

        return axios
          .post(
            "https://sign.client.api.stag.signapsesolutions.com/v1/sign-requests/train-announcements",
            requestData,
            { headers }
          )
          .then((response) => {
            const downloadLink = response.data.data.downloadLink;
            setVideoUrl(downloadLink); // Update the videoUrl state
            return downloadLink;
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((authError) => {
        console.error(authError);
      });
  };

  useEffect(() => {
    postRequest();
  }, []);

  useEffect(() => {
    if (videoUrl) {
      setShowVideo(true); // Show the video when a download link is available
    }
  }, [videoUrl]);

  return (
    <div>
      {showVideo ? (
        <video src={videoUrl} controls autoPlay>
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoPage;

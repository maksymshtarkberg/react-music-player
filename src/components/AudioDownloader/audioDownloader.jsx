import React, { useState } from "react";
import axios from "axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const AudioDownloader = ({ songIdTrack, fileName }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hover, setHover] = useState(false); // New hover state

  const downloadAudio = async (event) => {
    event.stopPropagation();
    try {
      setIsDownloading(true);

      const __URL__ = process.env.REACT_APP_URL;
      const URL = `${__URL__}/api/v1/${songIdTrack}/file`;
      const { data } = await axios.get(URL, {
        responseType: "blob",
      });

      // Create a Blob URL for the audio content
      const audioBlob = new Blob([data], { type: "audio/mp3" });
      const audioBlobUrl = window.URL.createObjectURL(audioBlob);
      console.log(audioBlobUrl);
      // Create a hidden anchor element and trigger a click event to download the audio
      const downloadLink = document.createElement("a");
      downloadLink.href = audioBlobUrl;
      downloadLink.download = fileName; // Set the desired file name here
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading audio:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "opacity 0.3s ease-in-out, background-color 0.2s",
        opacity: isDownloading ? 0.5 : hover ? 0.8 : 1,
        backgroundColor: hover ? "#C8C8C8" : "transparent",
        margin: "0 auto",
        borderRadius: 6,
      }}
      onClick={(event) => !isDownloading && downloadAudio(event)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isDownloading ? (
        "Downloading..."
      ) : (
        <div className="download-icon">
          <FileDownloadIcon />
        </div>
      )}
    </div>
  );
};

export default AudioDownloader;

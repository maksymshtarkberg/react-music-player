import React, { useRef } from "react";
import "./styles.css";

export default function AboutProject() {
  const technologies = [
    ["React", "Redux", "CSS", "THREE.js"],
    ["Node.js", "Multer", "MongoDB"],
  ];
  const borderref = useRef(null);

  const handleHoverImgBorder = () => {
    borderref.current.className = "image-border-hover";
  };
  const removeHover = () => {
    borderref.current.className = "image-border";
  };
  return (
    <div id="aboutSection" className="about-container">
      <div className="about-content">
        <div className="title-bar">
          <div className="title-wrapper">
            <span className="title-text">About Music Player</span>
          </div>
        </div>

        <div className="description-section">
          <div className="description-text">
            <div className="description-paragraph">
              <span className="text">
                This player was created by Maksym Shtarkberg, not for a
                commercial using, but like a demonstration of my development
                skills.
              </span>
            </div>
            <div className="description-paragraph">
              <p className="text">
                <span className="highlight">Audio Context Management:</span>{" "}
                Full integration and control of audio files to ensure
                high-quality playback.
              </p>
              <p className="text">
                <span className="highlight">MVC Structure:</span> Creation of a
                robust backend based on the MVC pattern, ensuring clean and
                maintainable code.
              </p>
              <p className="text">
                <span className="highlight">Data Processing:</span> Retrieving
                and processing data from the server for smooth application
                performance.
              </p>
              <p className="text">
                <span className="highlight">File Handling:</span> Uploading
                files to the database and deleting temporary files on the server
                to optimize space.
              </p>
              <p className="text">
                <span className="highlight">User Authentication:</span> Secure
                authentication system to ensure user safety and personalization.
              </p>
              <p className="text">
                <span className="highlight">Profile Editing:</span> Ability to
                edit user profiles to enhance the user experience.
              </p>
              <p className="text">
                <span className="highlight">Playlist Creation:</span> Easy
                creation of playlists and adding songs to them for user
                convenience.
              </p>
            </div>
            <div className="description-paragraph">
              <p className="text">
                This project demonstrates my ability to develop functional and
                user-friendly applications focused on the end user.
              </p>
            </div>

            <div className="technologies-intro">
              <span className="text">
                Here are a technologies I used for this project:
              </span>
            </div>
            <div className="technologies-list">
              <div className="tech-column">
                <div className="tech-items">
                  <p className="text">Front-End:</p>
                  {technologies[0].map((tech, index) => (
                    <div key={index} className="tech-item">
                      <span className="tech-text">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tech-column">
                <div className="tech-items">
                  <p className="text">Back-end:</p>
                  {technologies[1].map((tech, index) => (
                    <div key={index} className="tech-item">
                      <span className="tech-text">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="image-desktop"
            onMouseEnter={handleHoverImgBorder}
            onMouseLeave={removeHover}
          >
            <a
              href="https://www.linkedin.com/in/maksym-shtarkberg/"
              target={"_blank"}
              rel="noreferrer"
            >
              <div ref={borderref} className="image-border"></div>
              <div className="image-wrapper">
                <div className="image-overlay"></div>
                <img src={"/me.jpg"} className="image" alt="Not Found" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useRef } from "react";
import "./styles.css";

export default function AboutProject() {
  const technologies = [
    ["React", "Redux", "CSS"],
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
              <span className="text">
                The development process included working with{" "}
                <span className="highlight">audio context</span>, creating a
                backend in{" "}
                <span className="highlight">MVC pattern structure</span>,
                receiving data from the backend, processing{" "}
                <span className="highlight">file uploads</span> to the database,{" "}
                <span className="highlight">deleting temporary files</span> on
                the server, <span className="highlight">authentication</span> of
                users, editing a profile,{" "}
                <span className="highlight">creating playlists</span> and adding
                songs to them.
              </span>
            </div>

            <div className="technologies-intro">
              <span className="text">
                Here are a technologies I used for this project:
              </span>
            </div>
            <div className="technologies-list">
              <div className="tech-column">
                <div className="tech-items">
                  <p className="text">Front-End</p>
                  {technologies[0].map((tech, index) => (
                    <div key={index} className="tech-item">
                      <span className="tech-text">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tech-column">
                <div className="tech-items">
                  <p className="text">Back-end</p>
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
            <div ref={borderref} className="image-border"></div>
            <div className="image-wrapper">
              <div className="image-overlay"></div>
              <img src={""} className="image" alt="Not Found" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

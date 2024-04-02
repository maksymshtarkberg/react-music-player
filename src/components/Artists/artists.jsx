import { useState } from "react";
import useDragScroll from "../../util/useDragScroll";
import artists from "../../assets/artist-default.png";

const Artists = ({ artists }) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useDragScroll();

  return (
    <div class="artists">
      <h1>Featured Artists</h1>
      <div
        className="artist-container containers"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {artists &&
          artists.map((artist, index) => {
            return (
              <div class="artist" key={index}>
                <img
                  src={
                    artist.artistName === "Future"
                      ? "https://images.genius.com/a3496b5fc4c6f7796e08548ab28aef18.1000x1000x1.jpg"
                      : artist.artistName === "$uicideBoy$"
                      ? "https://images.genius.com/3858815bfd12a53748553d09964fed4c.529x529x1.jpg"
                      : artist.artistName === "Led Zeppelin"
                      ? "https://images.genius.com/e4763bba12e6411077a3e573cd290da0.433x433x1.jpg"
                      : artist.artistName === "Lil Peep"
                      ? "https://images.genius.com/919c7ba130d3861740cbe7fbd7f83c59.1000x1000x1.jpg"
                      : artist.artistName === "Pink Floyd"
                      ? "https://images.genius.com/6b5c50912d99c3cf0eabfec5f427c452.1000x1000x1.jpg"
                      : artist.artistName === "The Weeknd"
                      ? "https://images.genius.com/1bab7f9dbd1216febc16d73ae4da9bd0.1000x1000x1.jpg"
                      : artists
                  }
                  alt="artist-cover"
                />
                <p>{artist.artistName}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Artists;

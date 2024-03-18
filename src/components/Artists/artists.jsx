import { useState } from "react";
import useDragScroll from "../../util/useDragScroll";

const Artists = () => {
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
        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c8feaa0f-6ae7-4c69-bb7d-4a11de76b4f5"
            alt=""
          />
          <p>Taylor Swift</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/bf80314e-5a02-4702-bb64-eae8c113c417"
            alt=""
          />
          <p>The Weeknd</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e4576af8-0e84-4343-8f90-7a01acb9c8b7"
            alt=""
          />
          <p>Dua Lipa</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d8eb2888-1e74-4117-82d7-833ad29e3cc1"
            alt=""
          />
          <p>Jimin</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/f23adc16-11d7-41dc-af6a-191e03a81603"
            alt=""
          />
          <p>Alicia Keys</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/f511c102-3217-4bea-bede-8be23b969bd8"
            alt=""
          />
          <p>Maroon 5</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/9a8bd237-b525-43e6-a37c-daaac39db8ce"
            alt=""
          />
          <p>Imagine Dragons</p>
        </div>

        <div class="artist">
          <img
            src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/99452c85-26f4-4ccd-b439-7d1bd3875634"
            alt=""
          />
          <p>Billie Eilish</p>
        </div>
      </div>
    </div>
  );
};

export default Artists;

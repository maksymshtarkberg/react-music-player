import useDragScroll from "../../util/useDragScroll";

const Albums = () => {
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useDragScroll();
  return (
    <div class="albums">
      <h1>Recommended Albums</h1>
      <div
        class="album-container containers"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div class="album">
          <div class="album-frame">
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/74c4f0f9-d73e-4737-83fa-ea4afe392229"
              alt=""
            />
          </div>
          <div>
            <h2>Views</h2>
            <p>Drake</p>
          </div>
        </div>

        <div class="album">
          <div class="album-frame">
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d3a0bac0-fdb4-467e-bdf5-f3f415928f24"
              alt=""
            />
          </div>
          <div>
            <h2>Speak Now</h2>
            <p>Taylor Swift</p>
          </div>
        </div>

        <div class="album">
          <div class="album-frame">
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/85521a12-cc46-4b9f-a742-21ba407ebd5e"
              alt=""
            />
          </div>
          <div>
            <h2>Born to Die</h2>
            <p>Lana Del Rey</p>
          </div>
        </div>

        <div class="album">
          <div class="album-frame">
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/4e7bf466-7fa5-4dad-b628-5bca12833b64"
              alt=""
            />
          </div>
          <div>
            <h2>Endless Summer Vacation</h2>
            <p>Miley Cyrus</p>
          </div>
        </div>

        <div class="album">
          <div class="album-frame">
            <img
              src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/f01f546a-7ab7-4e90-acb9-1c1e817b676d"
              alt=""
            />
          </div>
          <div>
            <h2>The Dark Side of The Moon</h2>
            <p>Pink Floyd</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Albums;

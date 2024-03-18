import { useState } from "react";

const useDragScroll = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - e.currentTarget.offsetLeft;
    const step = (x - startX) * 0.6;
    e.currentTarget.scrollLeft = scrollLeft - step;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave };
};

export default useDragScroll;

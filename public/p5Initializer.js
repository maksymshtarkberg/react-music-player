// p5Initializer.js
import p5 from "p5";

window.p5Instance = new p5(() => {
  // This is an empty sketch to ensure p5 is initialized properly
  // It is needed to use p5.sound classes like p5.FFT
});

export default window.p5Instance;

import { useCallback, useRef, useState } from "react";
import aalib from "aalib.js";

function App() {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");

  const initAalib = useCallback(() => {
    const videoWidth = document.querySelector("video").offsetWidth;
    const videoHeight = document.querySelector("video").offsetHeight;
    const aspectRatio = {
      width: Math.round(videoWidth / 4),
      height: Math.round(videoHeight / 8),
    };
    console.log(aspectRatio, "aspectRatio");
    aalib.read.video
      .fromVideoElement(document.querySelector("video"))
      .map(aalib.aa(aspectRatio))
      .map(
        aalib.render.canvas({
          width: videoWidth,
          height: videoHeight,
          el: document.querySelector("#video-scene"),
        })
      )
      .subscribe();
  }, []);

  const getBase64 = useCallback((file, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const handleChange = (event) => {
    getBase64(event.target.files[0], (base64) => {
      setVideoSrc(() => base64);
      if (!videoRef.current.className.includes("h-screen")) {
        videoRef.current.className = "h-screen opacity-0";
      }
    });
    setTimeout(() => {
      initAalib();
      videoRef.current.play();
    }, 200);
  };

  return (
    <div className="flex">
      <input type="file" name="file" onChange={handleChange} />
      <canvas id="video-scene" />
      <video
        loop
        controls
        src={videoSrc}
        className="opacity-0"
        ref={videoRef}
      />
    </div>
  );
}

export default App;

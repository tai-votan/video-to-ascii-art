import { useCallback, useRef, useState } from "react";
import aalib from "aalib.js";

function App() {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState("");

  const initAalibVideo = useCallback(() => {
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

  const initAalibImage = useCallback((src) => {
    aalib.read.image
      .fromURL(src)
      .map(aalib.aa({ width: 520, height: 143, colored: true }))
      .map(aalib.filter.inverse())
      .map(
        aalib.render.html({
          background: "#000",
          fontFamily: "Ubuntu Mono, monospace",
        })
      )
      .do(function (el) {
        document.body.appendChild(el);
      })
      .subscribe();
  }, []);

  const getBase64 = useCallback((file, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const handleChange = async (event) => {
    await getBase64(event.target.files[0], (base64) => {
      if (base64.includes("data:image")) {
        initAalibImage(base64);
      } else {
        setVideoSrc(() => base64);
        setTimeout(() => {
          initAalibVideo();
          videoRef.current.play();
        }, 200);
      }
    });
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <canvas id="video-scene" />
        <video
          loop
          controls
          src={videoSrc}
          ref={videoRef}
          className="h-screen opacity-0 absolute left-1/2 select-none -translate-x-1/2 -z-10"
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="opacity-0 absolute inset-0 cursor-pointer"
        />
      </div>
    </>
  );
}

export default App;

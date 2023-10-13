import fetchAndParseMDX from "./fetchAndParseMDX";
import { useEffect, useState } from "react";
import './globals.css'

const fetchSlides = async (currentSlide: number) => {
  const result = await fetchAndParseMDX(currentSlide);
  if (result) {
    console.log(result);
  }
  return result;
}

export default function Slides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [CurrentSlideContent, setCurrentSlideContent] = useState<unknown>("");
  const [isVisible, setIsVisible] = useState(true);
  if (currentSlide < 1) {
    setCurrentSlide(1);
  }

  useEffect(() => {
    const temp = async () => {
    const result = await fetchSlides(currentSlide);
    setCurrentSlideContent(result);
    if (result == "Slide not found") {
      setCurrentSlide(currentSlide - 1);
    }
  }
  temp();
  }, [currentSlide]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10);
    return () => clearTimeout(timer);
  }
  , [isVisible]);


  const SlideContent = () => {
      return <>{CurrentSlideContent ? CurrentSlideContent : <p
      className="">Loading...</p>}</>
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "ArrowRight") {
      setCurrentSlide(currentSlide + 1);
    }
    if (event.key === "ArrowLeft") {
      setCurrentSlide(currentSlide - 1);
    }
    if (event.key === "ArrowUp") {
      setCurrentSlide(currentSlide - 1);
    }
    if (event.key === "ArrowDown") {
      setCurrentSlide(currentSlide + 1);
    }
  }


  return (
    <>
<div className="screen-div" onKeyDown={handleKeyDown} tabIndex={0}>      
<div className={`slide_controller ${isVisible ? "visible" : "hidden"}`}
onMouseEnter={() => setIsVisible(true)}
onMouseLeave={() => setIsVisible(false)}
>
     <h1>Slide - {currentSlide}</h1>
     <div>
     <h2>
        <button onClick={
          () => setCurrentSlide(currentSlide - 1)
        } onKeyDown={handleKeyDown} className=""
        >Previous</button>
      <button onClick={() => setCurrentSlide(currentSlide + 1)
      } onKeyDown={handleKeyDown} className=""
      >Next</button>
      </h2>
      </div>
      </div>
      <div className="slide-div">
      <SlideContent />
      </div>
      </div>
    </>
  );
}




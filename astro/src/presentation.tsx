import {useEffect, useState } from "react";
import {getMDXComponent} from 'mdx-bundler/client'
import './globals.css'
import { Title, Subtitle, IntroTransition, SecondSlideTransition } from "./components/title";



function SlideController({ currentSlide, setCurrentSlide }: any) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={`slide_controller ${isHovered ? "visible" : "hidden"}`}
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
>
     <h1>Slide - {currentSlide}</h1>
     <div>
     <h2>
        <button onClick={
          () => setCurrentSlide(currentSlide - 1)
        } className=""
        >Previous</button>
      <button onClick={() => setCurrentSlide(currentSlide + 1)
      } className=""
      >Next</button>
      </h2>
      </div>
      </div>
  )
  
}

const fetchSlides = async () => {
  const DataFetch = await fetch (`/api/slides`).then((res) => res.text()).then((res) => JSON.parse(res))

  if (!DataFetch) {
    return null;
  }

  return {
    slideCount: DataFetch.slideCount,
    slides : DataFetch.slides,
  };

}

function IndividualSlide({ currentSlide, slot, fetchedSlides }: { currentSlide: number, slot: number, fetchedSlides: any }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [Slides, setSlides] = useState<JSX.Element[]>([]);
  useEffect(() => {
    const temp = async () => {
      if (fetchedSlides !== undefined) {
    console.log(fetchedSlides);
    const allSlides = fetchedSlides.slides.map((slide: any, index: number) => {
      const Component = getMDXComponent(slide.code);
      return (
        <>
      
       { <div key={index}>
          <Component components={{ 
            Title: (props: any) => ( <Title {...props} />),
            Subtitle: (props: any) => ( <Subtitle {...props} />),
            IntroTransition: (props: any) => ( <IntroTransition {...props} />),
            SecondSlideTransition: (props: any) => ( <SecondSlideTransition {...props} />),
            }} />
        </div> 
          }
        </>
      );      }
    );
    setSlides(allSlides);

  }
  }
  temp();

  }
  , [currentSlide, fetchedSlides]);

  useEffect(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 10000);
  return () => {
    setIsTransitioning(false);
  }
  }
  , [currentSlide]);
    return (
    <>
    { Slides ? 
    <div className={`slide ${currentSlide === slot ? "" : `${currentSlide === slot + 1 && isTransitioning ? "visible no-transition" : "hidden"}`}${currentSlide === slot && isTransitioning ? "transitioning" : ""}`} key={slot}>
    {Slides[slot - 1]}
    </div>
    : <p>Loading...</p> 
    }
    </>
    )
}


export default function Slides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(1);
  const [fetchedSlides, setFetchedSlides] = useState({
    slideCount: 1,
    slides: [
      {
        code: "",
        frontmatter: {},
      },
    ],
  });

  if (currentSlide < 1) {
    setCurrentSlide(1);
  }

  if (currentSlide > slideCount) {
    setCurrentSlide(slideCount);
  }

  useEffect(() => {
    const temp = async () => {
    const result = await fetchSlides();
    if (result === null) {
      setCurrentSlide(currentSlide - 1);
    }
    setFetchedSlides({ slideCount: result?.slideCount, slides: result?.slides });
    setSlideCount(result?.slideCount);
  }
  temp();
  }, []);

  



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
  <SlideController currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <div className="slide-div">
      <IndividualSlide currentSlide={currentSlide} slot={currentSlide - 1} fetchedSlides={fetchedSlides} />
        <IndividualSlide currentSlide={currentSlide} slot={currentSlide} fetchedSlides={fetchedSlides} />
        <IndividualSlide currentSlide={currentSlide} slot={currentSlide + 1} fetchedSlides={fetchedSlides} />
      </div>
      </div>
    </>
  );
}




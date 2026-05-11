import bgvideo from "../assets/bgvideorado.mp4"
import "./Hero.css"

const  Hero = () => {
  
  return (
  
    <div className="hero">
     
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline>
        <source
          src={bgvideo}
          type="video/mp4"
        />

      </video>

      
    </div>
  );
};

export default Hero;




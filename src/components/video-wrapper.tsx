import intro_text from '../assets/overlay-text.png';
import intro_image from '../assets/start_2min2.png';
import intro_video from '../assets/webtrailer.mp4';

const VideoWrapper = () => (
  <div className="relative">
    <img
      className="hidden-on-desktop size-full object-cover"
      src={intro_image.src}
      alt="Three people discovering the mysteries of an escape room at the Skurrilum"
    />
    <video
      autoPlay
      muted
      loop
      className="hidden-on-mobile size-full object-cover object-top"
      aria-label="Introductory video showing the escape room experience at Skurrilum">
      <source src={intro_video} type="video/mp4" />
    </video>
    <div className="absolute-center">
      <img
        src={intro_text.src}
        alt="Introductory text overlay"
        className="h-[200px] object-contain"
      />
    </div>
  </div>
);

export default VideoWrapper;

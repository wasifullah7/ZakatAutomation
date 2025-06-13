import React, { useState, useEffect } from 'react';
import './SignInSlider.css';

const slides = [
  {
    title: 'Learn to train',
    subtitle: 'on the newest AI security model',
    buttonText: 'Explore Now',
    image: '/images/laptop-screen.png',
    pattern: '/images/curved.png',
    bg: '#000B42',
    h1Style: {
      fontSize: 'clamp(40px, 6vw, 52px)',
      lineHeight: 1.1,
      fontFamily: '\'Inter\', sans-serif',
      letterSpacing: '-0.02em',
      marginBottom: '0.75rem',
      fontWeight: 700,
      color: 'white',
    },
    pStyle: {
      fontSize: 'clamp(20px, 3vw, 24px)',
      lineHeight: 1.4,
      fontFamily: '\'Inter\', sans-serif',
      fontWeight: 700,
      marginBottom: '0.25rem',
      color: 'white',
    },
    buttonStyle: {
      background: '#00F0FF',
      color: '#000B42',
      border: 'none',
      borderRadius: '6px',
      fontSize: '18px',
      fontWeight: 600,
      padding: '14px 32px',
      minWidth: '160px',
      fontFamily: '\'Inter\', sans-serif',
    },
    imageContainerStyle: {
      maxHeight: '45vh',
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: '-1px',
    },
    imageStyle: {
      width: '100%',
      height: 'auto',
      maxHeight: '100%',
      objectFit: 'contain',
      borderRadius: '4px',
    },
    patternStyle: {
      opacity: 0.8,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    },
    textMarginTop: 'clamp(20px, 3vh, 30px)',
    buttonMarginTop: '30px',
  },
  {
    title: 'Master the way',
    subtitle: 'of the digital defender.',
    buttonText: 'Explore Now',
    image: '/images/master-defender.png',
    pattern: '/images/curved-lines-top.png',
    bg: '#FFFFFF',
    h1Style: {
      fontSize: 'clamp(42px, 7vw, 54px)',
      lineHeight: 1.1,
      fontFamily: '\'Inter\', sans-serif',
      letterSpacing: '-0.02em',
      marginBottom: '0.25rem',
      color: '#000B42',
      fontWeight: 700,
    },
    pStyle: {
      fontSize: 'clamp(22px, 3.5vw, 26px)',
      lineHeight: 1.4,
      fontFamily: '\'Inter\', sans-serif',
      fontWeight: 500,
      marginBottom: '0.25rem',
      color: '#000B42',
      opacity: 0.8,
    },
    buttonStyle: {
      background: '#00F0FF',
      color: '#000B42',
      border: 'none',
      borderRadius: '6px',
      fontSize: '20px',
      fontWeight: 600,
      padding: '16px 36px',
      minWidth: '160px',
      fontFamily: '\'Inter\', sans-serif',
    },
    imageContainerStyle: {
      height: '50vh',
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      zIndex: 2,
      marginLeft: '-40px',
      marginBottom: '-40px',
      overflow: 'hidden',
    },
    imageStyle: {
      width: '70%',
      height: 'auto',
      objectFit: 'contain',
      objectPosition: 'left bottom',
      transform: 'scale(0.8) translate(-10%, 10%)',
      transformOrigin: 'bottom left',
    },
    patternStyle: {
      opacity: 0.15,
      backgroundPosition: 'right top',
      backgroundSize: '100% auto',
    },
    textMarginTop: 'clamp(30px, 4vh, 40px)',
    buttonMarginTop: '40px',
  },
  {
    title: 'See the dojo in action',
    subtitle: 'and explore cybersecurity tools.',
    buttonText: 'Explore Now',
    image: '/images/cybersecurity-tools.png',
    pattern: '/images/curved.png',
    bg: '#00F0FF',
    h1Style: {
      fontSize: 'clamp(32px, 4.5vw, 42px)',
      lineHeight: 1.1,
      fontFamily: '\'Inter\', sans-serif',
      letterSpacing: '-0.02em',
      marginBottom: '0.5rem',
      color: '#000B42',
      fontWeight: 700,
    },
    pStyle: {
      fontSize: 'clamp(16px, 2.2vw, 20px)',
      lineHeight: 1.4,
      fontFamily: '\'Inter\', sans-serif',
      fontWeight: 500,
      marginBottom: '0.25rem',
      color: '#000B42',
    },
    buttonStyle: {
      background: '#000B42',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '6px',
      fontSize: '18px',
      fontWeight: 600,
      padding: '14px 32px',
      minWidth: '160px',
      fontFamily: '\'Inter\', sans-serif',
    },
    imageContainerStyle: {
      height: 'auto',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    imageStyle: {
      width: '90%',
      height: 'auto',
      objectFit: 'contain',
      maxHeight: '100%',
      objectPosition: 'center bottom',
    },
    patternStyle: {
      opacity: 0.8,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    },
    textMarginTop: 'clamp(40px, 6vh, 60px)',
    buttonMarginTop: '30px',
  },
];

const SignInSlider = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[active];

  return (
    <div
      className="d-flex flex-column flex-lg-row-fluid position-relative"
      style={{ background: slide.bg, minWidth: '280px', maxWidth: '100%', flex: '0 0 40%' }}
    >
      {/* Pattern Overlay */}
      <div
        className="position-absolute top-0 end-0 w-100 h-100"
        style={{
          backgroundImage: `url('${slide.pattern}')`,
          backgroundPosition: slide.patternStyle.backgroundPosition,
          backgroundSize: slide.patternStyle.backgroundSize,
          opacity: slide.patternStyle.opacity,
          zIndex: 1,
        }}
      />

      {/* Main Content Area */}
      <div className="d-flex flex-column h-100" style={{ padding: 'clamp(30px, 6vh, 50px) clamp(16px, 4vw, 40px)', position: 'relative', zIndex: 2 }}>

        {/* Text Content */}
        <div className="text-content" style={{ marginTop: slide.textMarginTop }}>
          <h1 className="slider-title" style={slide.h1Style}>{slide.title}</h1>
          <p className="slider-subtitle" style={slide.pStyle}>{slide.subtitle}</p>
          <button className="explore-btn" style={{ ...slide.buttonStyle, marginTop: slide.buttonMarginTop }}>
            {slide.buttonText}
          </button>
        </div>

        {/* Laptop Image Container */}
        <div className="laptop-container" style={slide.imageContainerStyle}>
          <img src={slide.image} alt={slide.title} style={slide.imageStyle} />
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="carousel-indicators" style={{ bottom: 'clamp(15px, 4vh, 25px)', zIndex: 5 }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            data-bs-target="#kt_sign_in_slider"
            data-bs-slide-to={idx}
            className={idx === active ? 'active' : ''}
            onClick={() => setActive(idx)}
            style={{
              width: '30px',
              height: '10px',
              borderRadius: '5px',
              backgroundColor: idx === active ? '#00F0FF' : 'rgba(255,255,255,0.5)',
              margin: '0 8px',
              border: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignInSlider; 
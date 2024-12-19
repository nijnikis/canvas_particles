import React, { useEffect, useRef, useState } from "react";


export const CanvasParticles = (props) => {
  const {
    canvasStyle,
    config,
  } = props;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  let particles = [];

  const drawBg = () => {
    contextRef.current.fillStyle = 'rgb(12, 9, 29)';
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Particle Constructor
  const Particle = function (x, y) {
    this.x = x || Math.round(Math.random() * canvasRef.width);
    this.y = y || Math.round(Math.random() * canvasRef.height);
    this.r = config.radius;
    // speed
    this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
    // particle direction
    this.d = Math.round(Math.random() * 360);
    // particle direction curve
    this.cur = (Math.random() - 0.5) / 800;
    // particle timestamp
    this.t = Date.now();
    // particle exploded flag
    this.e = false;
    // particle burning flag
    this.b = true;
  };

  const updateParticleModel = function (p) {
    // if dead, kill func
    if (!p.b) {
      return p;
    }

    const timing = Date.now();
    const isTimeToDie = (timing - p.t) > 2000;

    // dying logic
    if (isTimeToDie) {
      p.r -= 0.1;
    }

    // if faded to 0, set dead ang kill func
    if (p.r <= 0) {
      p.b = false;
      return p;
    }

    // if not expoded, check if needs to explode
    if (!p.e) {
      const isTimeForSecondary = (timing - p.t) > 1000;
      if (isTimeForSecondary) {
        p.d = Math.round(Math.random() * 360);
        p.cur = (Math.random() - 0.5) / 800;
        p.e = true;
      }
    }

    // flight logic
    const a = 180 - (p.d + 90);
    p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) / config.jelly : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s) / config.jelly;
    p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) / config.jelly : p.y -= p.s * Math.sin(a) / Math.sin(p.s) / config.jelly;
    p.d = p.d + p.cur;
    return p;
  };

  const drawParticle = (x, y, r, c, e, b) => {
    // draw only if alive
    if (b) {
      const grad=contextRef.current.createRadialGradient(x, y, r/10, x, y, r);
      if (e) {
        const colorInner = 'rgba(' + 240 + ',' + 75 + ',' + 5 + ', 0.8)';
        grad.addColorStop(0, colorInner);
        const colorOutter = 'rgba(' + 181 + ',' + 4 + ',' + 51 + ', 0.1)';
        grad.addColorStop(0.3, colorOutter);
        const colorBg = 'rgba(' + 181 + ',' + 4 + ',' + 51 + ', 0)';
        grad.addColorStop(1, colorBg);
      } else {
        const colorInner = 'rgba(' + 253 + ',' + 238 + ',' + 152 + ', 0.8)';
        grad.addColorStop(0, colorInner);
        const colorOutter = 'rgba(' + 252 + ',' + 178 + ',' + 96 + ', 0.1)';
        grad.addColorStop(0.3, colorOutter);
        const colorBg = 'rgba(' + 252 + ',' + 178 + ',' + 96 + ', 0)';
        grad.addColorStop(1, colorBg);
      }
      contextRef.current.beginPath();
      contextRef.current.arc(x, y, r, 0, 2 * Math.PI);
      contextRef.current.fillStyle = grad;
      contextRef.current.fill();
      // contextRef.current.closePath();
    }
  };

  const cleanUpArray = function () {
    particles = particles.filter((p) => {
      return (p.x > -100 && p.y > -100); 
    });
    particles = particles.filter((p) => {
      return !!p.b; 
    });
  };

  const initParticles = function (blocksQuantity, shrapnelQuantity, x, y) {
    for (let i = 0; i < blocksQuantity; i++) {
      const block = new Particle(x, y);
      for (let j = 0; j < shrapnelQuantity; j++) {
        particles.push({...block});
      }
    }
    particles.forEach((p) => {
      drawParticle(p.x, p.y, p.r, p.c, p.e, p.b);
    });
  };

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  const frame = function () {
    if (contextRef.current) {
      drawBg();
      console.log('particles', particles);
      particles.map((p) => {
        return updateParticleModel(p);
      });
      particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c, p.e, p.b);
      });
      window.requestAnimFrame(frame);
    }
  };

  useEffect(() => {
    console.log('useEffect');
    const canvas = canvasRef.current;
    canvas.width = windowWidth * config.width / 100;
    canvas.height = windowHeight * config.height / 100;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    frame();
  }, [])

  const explosion = (event) => {
    console.log('explosion');
    const x = event.clientX - windowWidth * ((100 - config.width) / 2) / 100;
    const y = event.clientY - windowHeight * ((100 - config.height) / 2) / 100;
    cleanUpArray();
    initParticles(config.blocksQuantity, config.shrapnelQuantity, x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={explosion}
      style={canvasStyle}
    />
  )
};

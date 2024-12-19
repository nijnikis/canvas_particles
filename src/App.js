import React, { useEffect, useState, useRef } from 'react';
import { CanvasParticles } from './CanvasParticles/CanvasParticles';
import './App.css';

const canvasStyle = {
  display: 'block',
  backgroundColor: 'grey',
  cursor: 'pointer',
};

const config = {
  width: 90,
  height: 90,
  blocksQuantity: 5,
  shrapnelQuantity: 20,
  colorPalette: {
    bg: {r:12,g:9,b:29},
    matter: [
      {r:36,g:18,b:42},
      {r:78,g:36,b:42},
      {r:252,g:178,b:96},
      {r:253,g:238,b:152},
    ]
  },
  jelly: 5,
  radius: 10,
  maxSpeed: 0.1,
  colorVariation: 50,
};


function App() {

  return (
    <div className="App">
      <CanvasParticles
        canvasStyle={canvasStyle}
        config={config}
      />
    </div>
  );
}

export default App;

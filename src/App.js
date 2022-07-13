import React, { Fragment, useRef } from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import GameSettings from './components/GameSettings/GameSettings';

function App() {
  
  const gameGrid = useRef()

  const pausePathFinding = () => {
    console.log(gameGrid)
    gameGrid.current.playOrPause()
  }

  return (
    <Fragment>
      <GameSettings onPauseClick={pausePathFinding} />
      <GameGrid ref={gameGrid}/>
    </Fragment>
  );
}

export default App;

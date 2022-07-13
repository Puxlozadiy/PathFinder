import React, { Fragment, useRef } from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import GameSettings from './components/GameSettings/GameSettings';

function App() {
  
  const gameGrid = useRef()

  const pausePathFinding = () => {
    gameGrid.current.playOrPause()
  }

  const stopPathFinding = () => {
    gameGrid.current.stop()
  }

  const replayPathFinding = () => {
    gameGrid.current.replay()
  }

  return (
    <Fragment>
      <GameSettings onPauseClick={pausePathFinding} onStopClick={stopPathFinding} onReplayClick={replayPathFinding}/>
      <GameGrid ref={gameGrid}/>
    </Fragment>
  );
}

export default App;

import React from "react";
import './GameSettings.css'

import playPause from './assets/play-pause.png';
import stop from './assets/stop.jpg';
import replay from './assets/replay.png';

const GameSettings = (props) => {
    
    const playOrPauseHandler = () => {
        props.onPauseClick()
    }

    const stopHandler = () => {
        props.onStopClick()
    }
    
    const replayHandler = (event) => {
        props.onReplayClick()
    }

    return (
        <header>
            <div className="play-pause-stop-replay">
                <div id="play-pause" onClick={playOrPauseHandler}>
                    <img src={playPause} alt="" style={{height: '35px'}} draggable="false"></img>
                </div>
                <div id="stop" onClick={stopHandler}>
                    <img src={stop} alt="" style={{height: '35px'}} draggable="false"></img>
                </div>
                <div id="replay" onClick={replayHandler}>
                    <img src={replay} alt="" style={{height: '35px', width: '35px', pointerEvents:'none'}} draggable="false"></img>
                </div>
            </div>
        </header>
    )
}

export default GameSettings;
import React from "react";
import './GameSettings.css'

import playPause from './assets/play-pause.png';
import stop from './assets/stop.jpg';
import replay from './assets/replay.png';

const GameSettings = (props) => {
    
    const playOrPauseHandler = () => {
        props.onPauseClick()
    }
    

    return (
        <header>
            <div className="play-pause-stop-replay">
                <div id="play-pause" onClick={playOrPauseHandler}>
                    <img src={playPause} alt="" style={{height: '35px'}}></img>
                </div>
                <div id="stop">
                    <img src={stop} alt="" style={{height: '35px'}}></img>
                </div>
                <div id="replay">
                    <img src={replay} alt="" style={{height: '35px'}}></img>
                </div>
            </div>
        </header>
    )
}

export default GameSettings;
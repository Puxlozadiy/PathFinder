import React, {useState, useImperativeHandle, forwardRef, useEffect} from "react";
import './GameGrid.css';

const GameGrid = forwardRef((props, ref) => {
    let gridUnitsInitial = []
    let gridColumns = 100
    let gridRows = 100
    let pathList = []
    const [startPoint, setStartPoint] = useState(0)
    for(let y = 1; y < (gridColumns+1); y++){
        for(let x = 1; x < (gridRows+1); x++){
            gridUnitsInitial.push({x: x, y: y, type: 'unit'})
        }
    }

    useImperativeHandle(ref, () => {
        return {
            playOrPause: playOrPausePathFinding,
            stop: stopPathFinding,
            replay: replayPathFinding
        }
    })

    const setPathStartOrEnd = (event) => {
        if(startPoint === 0){
            event.target.className = 'gridUnit start'
            setStartPoint([event.target.getAttribute("meta").split('-')[0], event.target.getAttribute("meta").split('-')[1]])
        } else{
            let xStart = parseInt(startPoint[0])
            let yStart = parseInt(startPoint[1])
            pathList.push([[xStart, yStart]])
            event.target.className = 'gridUnit end'
            localStorage.setItem('isGamePaused', 'true')
            createPaths(startPoint)

        }
    }

    const setWall = (event) => {
        event.preventDefault()
        event.target.className = 'gridUnit wall' 
    }

    const createPaths = (start) => {
        let isPathFinded = false
        const pathCreator = setInterval(() => {
            /* if(isGamePaused) {
                clearInterval(pathCreator)
                return
            } */
            if(localStorage.getItem('isGamePaused') === 'false'){
                let temponaryPathList = [...pathList]
                let looplimit = pathList.length
                for(let path = 0; path < looplimit; path++){
                    let newPath = [...temponaryPathList[path]]
                    let lastXvalue = parseInt((newPath[newPath.length-1][0]))
                    let lastYvalue = parseInt((newPath[newPath.length-1][1]))
                    let isPathMoving = false
                    let rightDirection = document.getElementById(`${lastXvalue + 1}-${lastYvalue}`)
                    let leftDirection = document.getElementById(`${lastXvalue - 1}-${lastYvalue}`)
                    let downDirection = document.getElementById(`${lastXvalue}-${lastYvalue + 1}`)
                    let upDirection = document.getElementById(`${lastXvalue}-${lastYvalue - 1}`)
                    if((lastXvalue + 1) <= gridColumns && (lastXvalue + 1) >= 1){
                        if(rightDirection.className.search('default') >= 0  || rightDirection.className.search('end') >= 0){
                            temponaryPathList.push([...newPath, [lastXvalue + 1, lastYvalue]])
                            fillPathPiece(lastXvalue + 1, lastYvalue)
                            isPathMoving = true
                        }
                    }
                    if((lastXvalue - 1) <= gridColumns && (lastXvalue - 1) >= 1){
                        if(leftDirection.className.search('default') >= 0  || leftDirection.className.search('end') >= 0){
                            temponaryPathList.push([...newPath, [lastXvalue - 1, lastYvalue]])
                            fillPathPiece(lastXvalue - 1, lastYvalue)
                            isPathMoving = true
                        }
                    }
                    if((lastYvalue + 1) <= gridRows && (lastYvalue + 1) >= 1){
                        if(downDirection.className.search('default') >= 0  || downDirection.className.search('end') >= 0){
                            temponaryPathList.push([...newPath, [lastXvalue, lastYvalue + 1]])
                            fillPathPiece(lastXvalue, lastYvalue + 1)
                            isPathMoving = true
                        }
                    }
                    if((lastYvalue - 1) <= gridRows && (lastYvalue - 1) >= 1){
                        if(upDirection.className.search('default') >= 0 || upDirection.className.search('end') >= 0){
                            temponaryPathList.push([...newPath, [lastXvalue, lastYvalue - 1]])
                            fillPathPiece(lastXvalue, lastYvalue - 1)
                            isPathMoving = true
                        }
                    }
                    if(isPathMoving === false){
                        temponaryPathList.splice(path, 1)
                        path-=1
                        looplimit-=1
                    }
                    const [checkResult, endedPaths] = checkPaths(temponaryPathList)
                    isPathFinded = checkResult
                    if(isPathFinded === true){
                        clearInterval(pathCreator)
                        unfillPaths()
                        fillPaths(endedPaths)
                        break
                    }
                }
                pathList = [...temponaryPathList]
            }
            else{
                clearInterval(pathCreator)
                console.log('stopped')
                return
            }
        }, 300)
    }

    const fillPaths = (paths) => {
        for(let path = 0; path < paths.length; path++){
            for(let coord = 0; coord < paths[path].length; coord++){
                let pathPiece = document.getElementById(`${paths[path][coord][0]}-${paths[path][coord][1]}`)
                if(pathPiece.classList.value.search('wall') <= 0 && pathPiece.classList.value.search('end') <= 0 && pathPiece.classList.value.search('start') <= 0 && pathPiece.classList.value.search('passedPath')){
                    pathPiece.classList.add('passedPath')
                    pathPiece.classList.remove('default')
                }
            }
        }
    }

    const fillPathPiece = (x, y) => {
        let pathPiece = document.getElementById(`${x}-${y}`)
        if(pathPiece.classList.value.search('wall') <= 0 && pathPiece.classList.value.search('end') <= 0 && pathPiece.classList.value.search('start') <= 0){
            pathPiece.classList.add('passedPath')
            pathPiece.classList.remove('default')
        }
    }

    const unfillPaths = () => {
        for(let x = 1; x < gridColumns; x++){
            for(let y = 1; y < gridRows; y++){
                let pathPiece = document.getElementById(`${x}-${y}`)
                if(pathPiece.className.search('passedPath')>=0){
                    pathPiece.classList.remove('passedPath')
                    pathPiece.classList.add('default')
                }
            }
        }
    }

    const checkPaths = (paths) => {
        let isPathFinded = false
        let endedPaths = []
        for(let path = 0; path < paths.length; path++){
            let pathPiece = document.getElementById(`${paths[path][paths[path].length - 1][0]}-${paths[path][paths[path].length - 1][1]}`)
            if(pathPiece.className.search('end') >= 1){
                endedPaths.push([...paths[path]])
                isPathFinded = true
            }
        }
        return [isPathFinded, endedPaths]
    }

    const playOrPausePathFinding = () => {
        if(localStorage.getItem('isGamePaused') === 'true'){
            localStorage.setItem('isGamePaused', 'false')
            createPaths(parseInt(startPoint[0]), parseInt(startPoint[1]))
        }
        else localStorage.setItem('isGamePaused', 'true')
    }
    
    const stopPathFinding = () => {
        let xStart = parseInt(startPoint[0])
        let yStart = parseInt(startPoint[1])
        pathList = []
        pathList.push([[xStart, yStart]])
        unfillPaths()
        localStorage.setItem('isGamePaused', 'true')
        console.log(localStorage.getItem('isGamePaused'))
        createPaths(startPoint)
    }
    
    const replayPathFinding = () => {
        console.log('replay1')
        localStorage.setItem('isGamePaused', 'true') // to stop previous interval
        console.log(localStorage.getItem('isGamePaused'))
        //document.getElementById()
        setTimeout(() => {
            let xStart = parseInt(startPoint[0])
            let yStart = parseInt(startPoint[1])
            unfillPaths()
            pathList = []
            pathList.push([[xStart, yStart]])
            localStorage.setItem('isGamePaused', 'false')
            console.log(localStorage.getItem('isGamePaused'))
            createPaths(startPoint) 
            console.log('replay2') 
        }, 300)
    }

    return (
        <div id='game' style={{gridTemplateColumns: `${'30px '.repeat(gridColumns)}`}}>
            {gridUnitsInitial.map(value => {
                return <div meta={`${value.x}-${value.y}-${value.type}`} id={`${value.x}-${value.y}`} key={`${value.x}-${value.y}`} className={value.type === 'unit'? 'gridUnit default': value.type === 'gridUnit wall'? 'wall' : ''} onClick={setPathStartOrEnd} onContextMenu={setWall}></div>
            })}
        </div>
    )
})


export default GameGrid;

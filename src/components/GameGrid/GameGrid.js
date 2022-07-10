import React, {useState} from "react";
import './GameGrid.css';

const GameGrid = () => {
    let gridUnitsInitial = []
    let gridColumns = 100
    let gridRows = 100
    for(let x = 1; x < (gridColumns+1); x++){
        for(let y = 1; y < (gridRows+1); y++){
            gridUnitsInitial.push({x: x, y: y, type: 'unit'})
        }
    }
    const [gridUnits, setGridUnits] = useState(gridUnitsInitial)
    const [startPoint, setStartPoint] = useState(0)
    const [endPoint, setEndPoint] = useState(0)
    
    const setPathStartOrEnd = (event) => {
        if(startPoint === 0){
            event.target.className = 'gridUnit start'
            setStartPoint([event.target.getAttribute("meta").split('-')[0], event.target.getAttribute("meta").split('-')[1]])
        } else{
            event.target.className = 'gridUnit end'
            const endPointPosition = [event.target.getAttribute("meta").split('-')[0], event.target.getAttribute("meta").split('-')[1]]
            setEndPoint(endPointPosition)
            createPaths(startPoint, endPointPosition)
        }
    }

    const setWall = (event) => {
        event.preventDefault()
        event.target.className = 'gridUnit wall' 
    }

    const createPaths = (start, end) => {
        let xStart = parseInt(start[0])
        let yStart = parseInt(start[1])
        let xEnd = parseInt(end[0])
        let yEnd = parseInt(end[1])
        let pathList = []
        pathList.push([[xStart, yStart]])
        const pathCreator = setInterval(() => {
            let temponaryPathList = [...pathList]
            for(let path = 0; path < pathList.length; path++){
                let newPath = [...temponaryPathList[path]]
                let lastXvalue = parseInt((newPath[newPath.length-1][0]))
                let lastYvalue = parseInt((newPath[newPath.length-1][1]))
                let isPathMoving = false
                if((lastXvalue + 1) <= gridColumns && (lastXvalue + 1) >= 1){
                    if(document.getElementById(`${lastXvalue + 1}-${lastYvalue}`).className.search('wall') < 0 && document.getElementById(`${lastXvalue + 1}-${lastYvalue}`).className.search('passedPath') < 0){
                        temponaryPathList.push([...newPath, [lastXvalue + 1, lastYvalue]])
                        isPathMoving = true
                    }
                }
                if((lastXvalue - 1) <= gridColumns && (lastXvalue - 1) >= 1){
                    if(document.getElementById(`${lastXvalue - 1}-${lastYvalue}`).className.search('wall') < 0 && document.getElementById(`${lastXvalue - 1}-${lastYvalue}`).className.search('passedPath') < 0){
                        temponaryPathList.push([...newPath, [lastXvalue - 1, lastYvalue]])
                        isPathMoving = true
                    }
                }
                if((lastYvalue + 1) <= gridRows && (lastYvalue + 1) >= 1){
                    if(document.getElementById(`${lastXvalue}-${lastYvalue + 1}`).className.search('wall') < 0 && document.getElementById(`${lastXvalue}-${lastYvalue + 1}`).className.search('passedPath') < 0){
                        temponaryPathList.push([...newPath, [lastXvalue, lastYvalue + 1]])
                        isPathMoving = true
                    }
                }
                if((lastYvalue - 1) <= gridRows && (lastYvalue - 1) >= 1){
                    if(document.getElementById(`${lastXvalue}-${lastYvalue - 1}`).className.search('wall') < 0 && document.getElementById(`${lastXvalue}-${lastYvalue - 1}`).className.search('passedPath') < 0){
                        temponaryPathList.push([...newPath, [lastXvalue, lastYvalue - 1]])
                        isPathMoving = true
                    }
                }
                if(!isPathMoving){
                    temponaryPathList.splice(path, 1)
                }
                const [isPathFinded, endedPaths] = checkPaths(temponaryPathList)
                if(isPathFinded === true){
                    clearInterval(pathCreator)
                    fillPaths(endedPaths)
                    break
                }
            }
            pathList = temponaryPathList
            fillPaths(temponaryPathList)
            console.log('хуй')
        }, 100)
    }

    const fillPaths = (paths) => {
        for(let path = 0; path < (paths.length -1); path++){
            for(let coord = 0; coord < (paths[path].length-1); coord++){
                let pathPiece = document.getElementById(`${paths[path][coord][0]}-${paths[path][coord][1]}`)
                if(pathPiece.className.search('wall') <= 0 && pathPiece.className.search('end') <= 0 && pathPiece.className.search('start') <= 0){
                    pathPiece.classList.add('passedPath')
                }
            }
        }
    }

    const unfillPaths = () => {
        for(let x = 1; x < (gridColumns+1); x++){
            for(let y = 1; y < (gridRows+1); y++){
                let pathPiece = document.getElementById(`${x}-${y}`)
                if(pathPiece.className.search('start') < 0 && pathPiece.className.search('end') < 0 && pathPiece.className.search('wall') < 0)
                pathPiece.classList.remove('passedPath')
            }
        }
    }

    const checkPaths = (paths) => {
        let isPathFinded = false
        let endedPaths = []
        for(let path = (paths.length -5); path < (paths.length -1); path++){
            if(path < 0) path = 0
            for(let coord = 0; coord < (paths[path].length -1); coord++){
                let pathPiece = document.getElementById(`${paths[path][coord][0]}-${paths[path][coord][1]}`)
                if(pathPiece.className.search('wall') >= 1){
                    paths = paths.filter(value => {
                        if(value !== paths[path]) return value
                    })
                    break
                }
                if(pathPiece.className.search('end') >= 1){
                    endedPaths.push(paths[path])
                    console.log('Path founded!')
                    isPathFinded = true
                }
            }
        }

        return [isPathFinded, endedPaths]
    }

    

    
    return (
        <div id='game' style={{gridTemplateColumns: `${'30px '.repeat(gridColumns)}`}}>
            {gridUnits.map(value => {
                return <div meta={`${value.x}-${value.y}-${value.type}`} id={`${value.x}-${value.y}`} key={`${value.x}-${value.y}`} className={value.type === 'unit'? 'gridUnit default': value.type === 'gridUnit wall'? 'wall' : ''} onClick={setPathStartOrEnd} onContextMenu={setWall}></div>
            })}
        </div>
    )
}


export default GameGrid;
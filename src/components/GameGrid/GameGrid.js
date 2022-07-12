import React, {useState} from "react";
import './GameGrid.css';

const GameGrid = () => {
    let gridUnitsInitial = []
    let gridColumns = 100
    let gridRows = 100
    for(let y = 1; y < (gridColumns+1); y++){
        for(let x = 1; x < (gridRows+1); x++){
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
            console.log(event.target.getAttribute("meta"))
        } else{
            event.target.className = 'gridUnit end'
            const endPointPosition = [event.target.getAttribute("meta").split('-')[0], event.target.getAttribute("meta").split('-')[1]]
            setEndPoint(endPointPosition)
            createPaths(startPoint, endPointPosition)
            console.log(event.target.getAttribute("meta"))
        }
    }

    const setWall = (event) => {
        event.preventDefault()
        event.target.className = 'gridUnit wall' 
    }

    const createPaths = (start, end) => {
        let xStart = parseInt(start[0])
        let yStart = parseInt(start[1])
        let pathList = []
        let isPathFinded = false
        let actualPathLength = 2
        pathList.push([[xStart, yStart]])
        const pathCreator = setInterval(() => {
            let temponaryPathList = [...pathList]
            let looplimit = pathList.length
            let gridUnits = [[]]
            for(let y = 1; y < (gridColumns+1); y++){
                gridUnits.push([[]])
                for(let x = 1; x < (gridRows+1); x++){
                    gridUnits[y].push([x, y, document.getElementById(`${x}-${y}`).className])
                }
            }
            for(let path = 0; path < looplimit; path++){
                console.log(actualPathLength)
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
                if(isPathMoving == false || temponaryPathList[path].length < actualPathLength){
                    //console.log(temponaryPathList[path] + ' - to delete')
                    temponaryPathList.splice(path, 1)
                    path-=1
                    looplimit-=1
                } //else console.log(temponaryPathList[path] + ' - wont be deleted')
                const [checkResult, endedPaths] = checkPaths(temponaryPathList)
                isPathFinded = checkResult
                if(isPathFinded === true){
                    clearInterval(pathCreator)
                    unfillPaths()
                    fillPaths(endedPaths)
                    console.log('Path founded!')
                    break
                }
            }
            pathList = [...temponaryPathList]
            //if(!isPathFinded) fillPaths(temponaryPathList)
            console.log(temponaryPathList)
            actualPathLength+=1
            console.log('хуй')
        }, 100)
    }

    const fillPaths = (paths) => {
        for(let path = 0; path < paths.length; path++){
            for(let coord = 0; coord < paths[path].length; coord++){
                //console.log(`${paths[path][coord][0]}-${paths[path][coord][1]}`)
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
        if(pathPiece.classList.value.search('wall') <= 0 && pathPiece.classList.value.search('end') <= 0 && pathPiece.classList.value.search('start') <= 0 && pathPiece.classList.value.search('passedPath')){
            pathPiece.classList.add('passedPath')
            pathPiece.classList.remove('default')
        }
    }

    const unfillPaths = () => {
        for(let x = 1; x < gridColumns; x++){
            for(let y = 1; y < gridRows; y++){
                let pathPiece = document.getElementById(`${x}-${y}`)
                if(pathPiece.className.search('start') < 0 && pathPiece.className.search('end') < 0 && pathPiece.className.search('wall') < 0)
                pathPiece.classList.remove('passedPath')
            }
        }
    }

    const checkPaths = (paths) => {
        let isPathFinded = false
        let endedPaths = []
        for(let path = 0; path < paths.length; path++){
            let pathPiece = document.getElementById(`${paths[path][paths[path].length - 1][0]}-${paths[path][paths[path].length - 1][1]}`)
            if(pathPiece.className.search('end') >= 1){
                let minPathLength = Infinity
                endedPaths.push([...paths[path]])
                console.log(endedPaths)
                isPathFinded = true
            }
        }

        return [isPathFinded, endedPaths]
    }

    

    
    return (
        <div id='game' style={{gridTemplateColumns: `${'30px '.repeat(gridColumns)}`}}>
            {gridUnits.map(value => {
                return <div meta={`${value.x}-${value.y}-${value.type}`} id={`${value.x}-${value.y}`} key={`${value.x}-${value.y}`} className={value.type === 'unit'? 'gridUnit default': value.type === 'gridUnit wall'? 'wall' : ''} onClick={setPathStartOrEnd} onContextMenu={setWall}>{`${value.x}-${value.y}`}</div>
            })}
        </div>
    )
}


export default GameGrid;
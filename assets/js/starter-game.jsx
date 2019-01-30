import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tile from './tile.jsx'
import _ from 'lodash'

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: {},
      currentFlipped: [],
      totalFlipped: 0,
      isChecking: false,
    };
    this.onClick = this.onClick.bind(this)
  }

  componentWillMount() {
    this.setupGame();
  }

  onClick(id){
    const {tiles, totalFlipped, currentFlipped, isChecking} = this.state
    if(isChecking || tiles[id].flipped) return
    const updatedFlipped = currentFlipped.slice()
    updatedFlipped.push(id)
    const updatedState = {
      totalFlipped: totalFlipped + 1,
      currentFlipped: updatedFlipped,
      tiles: {
        ...tiles,
        [id]: {
          ...tiles[id],
          flipped: true
        }
      }
    }
    this.setState(updatedState)
    if(updatedState.currentFlipped.length == 2) this.checkMove(updatedState)
  }

  checkMove(state) {
    const {tiles, currentFlipped} = state;
    this.setState({...state, isChecking: true})
    let updatedState = {
      ...state,
      currentFlipped: [],
      isChecking: false
    }
    const flippedTiles = currentFlipped.map((id) => tiles[id])
    if(tiles[currentFlipped[0]].value !== tiles[currentFlipped[1]].value){
      updatedState = {
        ...updatedState,
        tiles: {
          ...tiles,
          [currentFlipped[0]]: {
            ...flippedTiles[0],
            flipped: false
          },
          [currentFlipped[1]]: {
            ...flippedTiles[1],
            flipped: false
          }
        }
      }
      return setTimeout(() => this.setState(updatedState), 1000)
    }
    const foundTiles = flippedTiles
      .map((tile) => { tile.found = true; return tile})
      .reduce((acc, tile) => { debugger; acc[tile.id] = tile; return acc }, {});
    updatedState.tiles = {
      ...tiles,
      ...foundTiles
    }
    debugger;
    this.setState(updatedState)
  }

  setupGame() {
    let letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ];
    letters = _.shuffle(letters.concat(letters))
    console.log(letters)
    const tiles = {}
    const newTile = {
      found: false,
      flipped: false
    }
    for(let i = 0; i < 16; i++) tiles[i] = {...newTile, value: letters[i], id: i}
    this.setState({totalFlipped: 0, currentFlipped: [], isChecking: false, tiles})
  }

  groupTiles(tiles) {
    let out = [];
    for(let i = 0; i < 4; i++){
      out.push(<div {...{className: 'row', key: i}}>{tiles.splice(0, 4)}</div>)
    }
    return out
  }

  buildTiles() {
    const {tiles} = this.state
    const tileComponents =  Object.values(tiles).map((tile, key) => {
      return <Tile {...{...tile, onClick: this.onClick, key}}/>;
    })
    return this.groupTiles(tileComponents);
  }

  render() {
    const { totalFlipped } = this.state;
    const tiles = this.buildTiles();
    return <div className="container">
      <div className="row">
        <h1 className="column">Total Tiles Flipped: {totalFlipped}</h1>
        <div className="column">
          <button className="float-right" onClick={() => this.setupGame()}>restart</button>
        </div>
      </div>
      <div className="container game-board">
        {tiles}
      </div>
    </div>;
  }
}

Starter.propTypes = {
  tiles: PropTypes.object
}



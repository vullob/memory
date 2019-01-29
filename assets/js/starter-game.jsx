import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tile from './tile.jsx'
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: []
    };
  }

  componentWillMount() {
    let letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ];
    letters = letters.concat(letters).sort((a,b) => Math.round(Math.random()))
    const tiles = []
    const newTile = {
      flipped: false
    }
    for(let i = 0; i < 16; i++) tiles.push({...newTile, value: letters[i]})
    this.setState({tiles})
  }

  groupTiles(tiles) {
    let out = [];
    for(let i = 0; i < 4; i++){
      out.push(<div className="row" style={{width: '46vw', height:'12vh', margin: 'auto'}}>{tiles.splice(0, 4)}</div>)
    }
    return out
  }

  buildTiles() {
    const {tiles} = this.state
    const tileComponents =  tiles.reduce((acc, tile) => {
      const letterTiles = [<Tile {...{tile}}/>, <Tile {...{tile}}/>];
      return acc.concat(letterTiles);
    }, [])
    return this.groupTiles(tileComponents);
  }

  render() {
    const tiles = this.buildTiles();
    return <div className="gameBoard" style={{
      margin: 'auto', width: '50vw', border: '3px solid black', padding: '10px'}}>
      {tiles}
    </div>;
  }
}

Starter.propTypes = {
  tiles: PropTypes.array
}



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


  groupTiles(tiles) {
    let out = [];
    for(let i = 0; i < 4; i++){
      out.push(<div className="row">{tiles.splice(0, 3)}</div>)
    }
    return out
  }

  buildTiles() {
    const letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ];
    const out =  letters.reduce((acc, letter) => {
      const letterTiles = [<Tile {...{letter}}/>, <Tile {...{letter}}/>];
      return acc.concat(letterTiles);
    }, [])
    return out.sort((a,b) => Math.round(Math.random()))
  }

  render() {
    const tiles = this.groupTiles(this.buildTiles());
    return <div classname="gameBoard" style={{
    margin: 'auto', width: '50vw', border: '3px solid black', padding: '10px'}}>
      {tiles}
    </div>;
  }
}

Starter.propTypes = {
  tiles: PropTypes.array
}



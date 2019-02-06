import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Tile from './tile.jsx'
import _ from 'lodash'

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    const { channel } = this.props;
    this.state = {
      tiles: {},
      currentFlipped: [],
      totalFlipped: 0,
      isChecking: false,
    };
    this.onClick = this.onClick.bind(this)
    window.channel = channel
    channel.join("memory").receive("ok", (game)=>{this.setState({tiles: game.game.tiles});})
    channel.on("updateBoard", (game) => {this.setState({...game.game}); console.log(game.game)})
  }


  onClick(id){
    const { channel } = this.props;
    channel.push("flip", {id}).receive("ok", (game) => {this.setState({...game.game}); console.log(game.game)})
  }


  groupTiles(tiles) {
    let out = [];
    for(let i = 0; i < 4; i++){
      tiles && out.push(<div {...{className: 'row', key: i}}>{tiles.splice(0, 4)}</div>)
    }
    return out
  }

  resetGame(){
    const { channel } = this.props;
    channel.push("new").receive("ok", (game) => this.setState({...game.game}))
  }


  groupTiles(tiles) {
    let out = [];
    for(let i = 0; i < 4; i++){
      tiles && out.push(<div {...{className: 'row', key: i}}>{tiles.splice(0, 4)}</div>)
    }
    return out
  }

  buildTiles() {
    const {tiles} = this.state
    const tileComponents =  tiles && Object.values(tiles).map((tile, key) => {
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
          <button className="float-right" onClick={() => this.resetGame()}>restart</button>
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



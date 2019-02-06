import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClick, id, letter, found} = this.props;
    return <React.Fragment>
      {letter && !found && <div className="column tile flipped"><h1>{letter}</h1></div>}
      {letter && found && <div className="column tile found"><h1>{letter}</h1></div>}
      {!letter && !found && <div className="column tile not-flipped" onClick={() => onClick(id)}></div>}
  </React.Fragment>
  }
}

Tile.propTypes = {
  id: PropTypes.number.isRequired,
  found: PropTypes.bool,
  letter: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}

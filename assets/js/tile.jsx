import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, onClick, flipped, id, found} = this.props;
    return <React.Fragment>
      {flipped && !found && <div className="column tile flipped" onClick={() => onClick(id)}><h1>{value}</h1></div>}
      {found && <div className="column tile found"><h1>{value}</h1></div>}
      {!flipped && !found && <div className="column tile not-flipped" onClick={() => onClick(id)}></div>}
  </React.Fragment>
  }
}

Tile.propTypes = {
  value: PropTypes.string.isRequired,
  flipped: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  found: PropTypes.bool.isRequired
}

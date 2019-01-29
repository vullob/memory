import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, onClick, flipped, id } = this.props;
    return <React.Fragment>
      {flipped && <div className="column tile flipped" onClick={() => onClick(id)}><h1>{value}</h1></div>}
      {!flipped && <div className="column tile not-flipped" onClick={() => onClick(id)}></div>}
  </React.Fragment>
  }
}

Tile.propTypes = {
  value: PropTypes.string.isRequired,
  flipped: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

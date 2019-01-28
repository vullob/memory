import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  render() {
    const { letter } = this.props;
    const { clicked } = this.props;

    return <div className="tile" style={{
      display: 'inline-block', margin: '2%',
      height: '10vw', width: '10vh', backgroundColor: 'blue'}}></div>
  }
}

Tile.propTypes = {
  letter: PropTypes.string
}

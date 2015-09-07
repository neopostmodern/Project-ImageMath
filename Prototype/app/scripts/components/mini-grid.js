import React from 'react';
import classNames from 'classnames';

export default class MiniGrid extends React.Component {
  render () {
    let grid = [];

    for (let y = 0; y < 10; y++) {
      let cells = [];

      for (let x = 0; x < 10; x++) {
        //if (this.props.grid[x][y]) {
        //}

        let classes = classNames('cell', { 'active' : this.props.grid[x][y] > 0});

        cells.push(
          <div className={classes}
               key={'mg-' + y + '-' + x}>
          </div>);
      }

      grid.push(<div className="row" key={y}>{cells}</div>);
    }

    return (
      <div className="mini-map" id="mini-grid">
        {grid}
      </div>
    );
  }
}
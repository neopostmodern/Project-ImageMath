import React from 'react';
import classNames from 'classnames';

export default class MiniGrid extends React.Component {
  render () {
    let grid = [];

    for (let y = 0; y < 10; y++) {
      let cells = [];

      for (let x = 0; x < 10; x++) {
        let cellHovered = this.props.hoveredCell && this.props.hoveredCell.x === x && this.props.hoveredCell.y === y;
        let cellContent;
        if (cellHovered) {
          cellContent = <div className="human-indicator"></div>;
        }

        let classes = classNames('cell', { 'active' : this.props.grid[x][y] === 1});

        cells.push(
          <div className={classes}
               key={'mg-' + y + '-' + x}
               onMouseEnter={this.props.onMouseEnterCell.bind(null, x, y)}
               onClick={this.props.onToggleCell.bind(null, x, y)}>
            {cellContent}
          </div>
        );
      }

      grid.push(<div className="row" key={y}>{cells}</div>);
    }

    return (
      <div className="mini-map"
           id="mini-grid"
           onMouseLeave={this.props.onMouseLeaveGrid.bind(null)}>
        {grid}
      </div>
    );
  }
}
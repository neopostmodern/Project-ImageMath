import React from 'react';
import classNames from 'classnames';

export default class MiniGrid extends React.Component {
  render () {
    let props = this.props;

    return (
      <div className="mini-map"
           id="mini-grid"
           onMouseLeave={this.props.onMouseLeaveGrid.bind(null)}>
        {props.grid.map(function (row, y) {
            return <div className="row" key={y}>
              {row.map(function (cell, x) {
                let cellHovered = props.hoveredCell && props.hoveredCell.x === x && props.hoveredCell.y === y;
                let cellContent;
                if (cellHovered) {
                  cellContent = <div className="human-indicator"></div>;
                }

                let classes = classNames('cell', {'active': props.grid[x][y] === 1});

                return <div className={classes}
                            key={'mg-' + y + '-' + x}
                            onMouseEnter={props.onMouseEnterCell.bind(null, x, y)}
                            onClick={props.onToggleCell.bind(null, x, y)}>
                  {cellContent}
                </div>;
              })}
            </div>;
          }
        )}
      </div>
    );
  }
}
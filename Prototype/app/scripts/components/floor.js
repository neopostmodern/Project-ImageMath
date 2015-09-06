import React from 'react';
import classNames from 'classnames';

export default class Floor extends React.Component {
  render () {
    let grid = [];
    let humans = [];
    for (let y = 0; y < 10; y++) {
      let cells = [];

      for (let x = 0; x < 10; x++) {
        if (this.props.grid[x][y]) {
          let position = {
            position : 'absolute',
            top : -120 - y * 17.5, // -270 to -120
            //left : -135 + x * 93 // -135 to 702 [bottom]
            //left : -5 + x * 64 // -135 to 702 [bottom]
            left : (-135 + y * 13) + x * (93 - y * 2.9) // -135 to 702 [bottom]
          };
          humans.push(<img className='human' style={position} src="images/people/man.svg" />);
        }

        let classes = classNames('cell', { 'active' : this.props.grid[x][y] > 0});

        cells.push(
          <div className={classes}
               key={y + '-' + x}
               onMouseEnter={this.props.onMouseEnterCell.bind(null, x, y)}
               onMouseLeave={this.props.onMouseLeaveCell.bind(null, x, y)}>
          </div>);
      }

      grid.push(<div className="row" key={y}>{cells}</div>);
    }

    return (
      <div id="floor">
        <div id="grid">
          {grid}
        </div>
        {humans}
      </div>
    );
  }
}
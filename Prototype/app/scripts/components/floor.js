import React from 'react';
import classNames from 'classnames';

const HumanImages = [
  "images/people/man.svg",
  "images/people/woman.svg",
  "images/people/child-f.svg",
  "images/people/child-m.svg"
];

export default class Floor extends React.Component {
  constructor() {
    super()


    let grid = new Array(10);
    for (var i = 0; i < 10; i++) {
      grid[i] = new Array(10);
      for (var j = 0; j < 10; j++) {
        grid[i][j] = null;
      }
    }

    this.state = {
      currentHumanImageId: 0,
      humanImageGrid: grid
    }
  }

  _onToggleCell(x, y) {
    if (!this.props.grid[x][y]) { // activating, currently inactive
      let change = {};
      change[x] = {};
      change[x][y] = { $set: this.state.currentHumanImageId };
      this.setState({ humanImageGrid: React.addons.update(this.state.humanImageGrid, change) });

      this.setState({currentHumanImageId: (this.state.currentHumanImageId + 1) % HumanImages.length});
    }

    this.props.onToggleCell(x, y);
  }

  render () {
    let grid = [];
    let humans = [];
    for (let inverted_y = 0; inverted_y < 10; inverted_y++) {
      let y = 9 - inverted_y;
      let cells = [];

      for (let x = 0; x < 10; x++) {
        let cellHovered = this.props.hoveredCell && this.props.hoveredCell.x == x && this.props.hoveredCell.y == y;
        let cellActive = this.props.grid[x][y];

        if (cellActive || cellHovered) {
          let position = {
            position : 'absolute',
            //top : -120 - inverted_y * 17.5, // -270 to -120
            top : 0.638 * y * y + 11.694 * y - 277, // [0, -277] / [4, -220] / [9, -120]
            //left : -135 + x * 93 // -135 to 702 [bottom]
            //left : -5 + x * 64 // -5 to 702 [bottom]
            left : (-135 + inverted_y * 15) + x * (93 - inverted_y * 3.3)
          };

          let humanImage; // can't ternary because active expression mustn't be evaluated before-hand
          if (cellActive) {
            humanImage = HumanImages[this.state.humanImageGrid[x][y]];
          } else {
            humanImage = HumanImages[this.state.currentHumanImageId];
          }

          humans.push(<img className='human'
                           style={position}
                           src={humanImage} />);
        }

        let classes = classNames('cell',
          { 'active' : cellActive,
            'hovered': cellHovered }
        );

        cells.push(
          <div className={classes}
               key={'f-' + y + '-' + x}
               onMouseEnter={this.props.onMouseEnterCell.bind(null, x, y)}
               onClick={this._onToggleCell.bind(this, x, y)}>
          </div>);
      }

      grid.push(<div className="row" key={y}>{cells}</div>);
    }

    return (
      <div id="floor">
        <div id="grid" onMouseLeave={this.props.onMouseLeaveGrid.bind(null)}>
          {grid}
        </div>
        {humans}
      </div>
    );
  }
}
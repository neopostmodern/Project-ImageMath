//import 'babel/polyfill';
import React from 'react/addons';
import classNames from 'classnames';
import _ from 'lodash';

import Floor from './components/floor.js';
import MiniGrid from './components/mini-grid.js';

class App extends React.Component {
  get DEACTIVATE () { return 'deactivate'; };
  get ACTIVATE () { return 'activate'; };
  get MOUSE_ENTER () { return 'mouse-enter'; };
  get MOUSE_LEAVE () { return 'mouse-leave'; };

  constructor() {
    super();

    let grid = new Array(10);
    for (var i = 0; i < 10; i++) {
      grid[i] = new Array(10);
      for (var j = 0; j < 10; j++) {
        grid[i][j] = 0;
      }
    }

    //grid[0][3] = 1;

    this.state = {
      grid: grid,
      hoveredCell: null
    };
  }

  componentDidMount() {
    // todo: fetch grid from server etc.
  }

  changeCellStatus(x, y, action) {
    let grid = this.state.grid;
    let newValue;

    if (action == this.DEACTIVATE) {
      newValue = 0;
    } else if (action == this.ACTIVATE) {
      newValue = 1;
    } else if (action == this.MOUSE_ENTER) {
      if (grid[x][y] == 0) {
        newValue = 0.5;
      }
    } else if (action == this.MOUSE_LEAVE) {
      if (grid[x][y] < 1) {
        newValue = 0;
      }
    } else {
      console.error("[App] Unknown action in 'changeCellStatus': " + action)
    }


    if (newValue != null) {
      let change = {};
      change[x] = {};
      change[x][y] = { $set: newValue };
      let updatedGrid = React.addons.update(grid, change);
      this.setState({grid: updatedGrid});

      //console.log("Changed " + x + "/" + y + " to " + newValue);
    }
  }

  _toggleCell(x, y) {
    if (this.state.grid[x][y]) {
      this.changeCellStatus(x, y, this.DEACTIVATE);
    } else {
      this.changeCellStatus(x, y, this.ACTIVATE);
    }
  }

  _mouseEnterCell(x, y) {
    this.setState({
      hoveredCell: { x: x, y: y }
    });
  }
  _mouseLeaveGrid() {
    this.setState({
      hoveredCell: null
    })
  }

  render() {
    // <img src="images/people/man.svg" style={{top: '-200px', left: '100px'}} />
    // <img src="images/people/woman.svg" style={{top: '-150px', left: '400px'}} />
    // <img src="images/people/woman.svg" style={{top: '-220px', left: '500px'}} />

    return (
      <div id="showroom">
        <div className="panel left">
          <div className="mini-map">
          </div>
          <div className="mini-map">
          </div>
        </div>
        <div className="wall">
          <img src="images/walls/wall-left.svg" />
        </div>
        <div id="stage">
          <div id="canvas">
          </div>
          <Floor grid={this.state.grid}
                 hoveredCell={this.state.hoveredCell}
                 onMouseEnterCell={this._mouseEnterCell.bind(this)}
                 onMouseLeaveGrid={this._mouseLeaveGrid.bind(this)}
                 onToggleCell={this._toggleCell.bind(this)}>
          </Floor>
        </div>
        <div className="wall">
          <img src="images/walls/wall-right.svg" />
        </div>
        <div className="panel right">
          <MiniGrid grid={this.state.grid}
                    hoveredCell={this.state.hoveredCell}>
          </MiniGrid>

          <div id="info">
            <h1>Project ImageMath</h1>
            <h2>Virtual Prototype</h2>
            <br/>
            Built on <a href="http://facebook.github.io/react/">React</a> written in JSX/ES6<br/>
            3D effects using CSS3, written in <a href="http://sass-lang.com/">SASS</a><br/>
            Open Source on <a href="https://github.com/neopostmodern/Project-ImageMath/tree/master/Prototype">GitHub</a>
            <br/>
            <br/>
            © 2015 <a href="http://neopostmodern.com/">NEO POST MODERN</a>
          </div>
        </div>
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));

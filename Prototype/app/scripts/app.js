//import 'babel/polyfill';
import React from 'react/addons';
import classNames from 'classnames';
import _ from 'lodash';

import Floor from './components/floor.js';
import Canvas from './components/canvas.js';
import Drawing from './components/drawing.js';
import MiniGrid from './components/mini-grid.js';

const MINIMUM_HEIGHT = 850;
const MINIMUM_WIDTH = 1540;

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

    this.state = {
      grid: grid,
      hoveredCell: null,
      windowSizeInsufficient: { x: 0, y: 0 }
    };
  }

  componentDidMount() {
    // todo: fetch grid from server etc.
    window.addEventListener("resize", this._updateDimensions.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._updateDimensions.bind(this));
  }
  componentWillMount() {
    this._updateDimensions()
  }
  _updateDimensions() {
    this.setState({ windowSize: {width: window.innerWidth, height: window.innerHeight }});
  }
  _ignoreScreenSizeWarning() {
    this.setState({ ignoreScreenSizeWarning: true });
  }

  changeCellStatus(x, y, action) {
    let grid = this.state.grid;
    let newValue;

    if (action == this.DEACTIVATE) {
      newValue = 0;
    } else if (action == this.ACTIVATE) {
      newValue = 1;
    } else if (action == this.MOUSE_ENTER) {
      console.warn("[App] MOUSE_ENTER deprecated for 'changeCellStatus'. No change commited.")
    } else if (action == this.MOUSE_LEAVE) {
      console.warn("[App] MOUSE_LEAVE deprecated for 'changeCellStatus'. No change commited.")
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
    if ((this.state.windowSize.width < MINIMUM_WIDTH || this.state.windowSize.height < MINIMUM_HEIGHT)
          && !this.state.ignoreScreenSizeWarning) {
      return <div style={{marginLeft: '5vw'}}>
        <h1>You're browser is too small.</h1>
        Maximize the window or try going fullscreen (F11).<br/>
        This experience has not been designed for mobile devices.
        <br/><br/>
        <i>Current size is {this.state.windowSize.width}x{this.state.windowSize.height}<br/>
          Required minimum is {MINIMUM_WIDTH}x{MINIMUM_HEIGHT}</i>
        <br/>
        <br/>
        _________
        <br/>
        <br/>
        You can ignore this, but be advised that it will drastically prejudice your experience.<br/>
        No functionality is guaranteed on small screens.<br/>
        <br/>
        <button type='button'
                onClick={this._ignoreScreenSizeWarning.bind(this)}
                style={{color: 'white', backgroundColor: 'black', border: '2px white solid', padding: '0.2rem 1rem'}}>
          IGNORE
        </button>
      </div>
    }

    return (
      <div id="showroom">
        <div className="panel left">
          <div className="mini-map">
            <Drawing grid={this.state.grid}
                     hoveredCell={this.state.hoveredCell}
                     src='images/img/quito.jpg'
                     orientation={Drawing.HORIZONTAL}>
            </Drawing>
          </div>
          <div className="mini-map">
            <Drawing grid={this.state.grid}
                     hoveredCell={this.state.hoveredCell}
                     src='images/img/fragezeichen.jpg'
                     orientation={Drawing.VERTICAL}>
            </Drawing>
          </div>

          <div className="info" style={{textAlign: 'right'}}>
            Hover over the floor to move.<br/>
            Click to place a human.<br/>
            Click again to remove her.
          </div>
        </div>
        <div className="wall">
          <img src="images/walls/wall-left.svg" />
        </div>
        <div id="stage">
          <Canvas grid={this.state.grid}
                  hoveredCell={this.state.hoveredCell}>
          </Canvas>
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

          <div className="info">
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

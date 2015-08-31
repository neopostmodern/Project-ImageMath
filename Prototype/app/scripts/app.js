//import 'babel/polyfill';
import React from 'react';
import classNames from 'classnames'

class App extends React.Component {
  render() {
    let grid = [];
    for (let i = 0; i < 10; i++) {
      let cells = [];

      for (let j = 0; j < 10; j++) {
        let human;
        if (i == 2 && j == 5) {
          human = <img src="images/people/man.svg" />;
        }
        cells.push(<div className="cell" key={i + '-' + j}></div>);
      }

      grid.push(<div className="row" key={i}>{cells}</div>);
    }

    console.log(grid);

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
          <div id="floor">
            <div id="grid">
              {grid}
            </div>
            <img src="images/people/man.svg" style={{top: '-200px', left: '100px'}} />
            <img src="images/people/woman.svg" style={{top: '-150px', left: '400px'}} />
            <img src="images/people/woman.svg" style={{top: '-220px', left: '500px'}} />
          </div>
        </div>
        <div className="wall">
          <img src="images/walls/wall-right.svg" />
        </div>
        <div className="panel right">
          <div className="mini-map">
          </div>

          <div id="info">
            <h1>Project ImageMath</h1>
            <h2>Virtual Prototype</h2>
            <br/>
            Built on <a href="http://facebook.github.io/react/">React</a> written in JSX/ES6
            with <a href="http://sass-lang.com/">SASS</a>
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

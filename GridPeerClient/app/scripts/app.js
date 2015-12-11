import React from 'react'
import ReactDOM from 'react-dom'

import Update from 'react-addons-update'
import ClassNames from 'classnames'

import SocketClient from 'socket.io-client'
import SocketP2P from 'socket.io-p2p'

import $ from 'jquery'
import Materialize from 'materialize'

import Preloader from './components/preloader'

const SERVER = "http://localhost:3030/";
const SIZE = 10;

class App extends React.Component {
  constructor() {
    super();

    let grid = [];
    for (let row_index = 0; row_index < SIZE; row_index++) {
      let row = [];
      for (let column_index = 0; column_index < SIZE; column_index++) {
        row.push(false);
      }
      grid.push(row);
    }

    this.state = {
      connected: -1,
      grid: grid
    };
  }

  componentWillMount() {
    this.connect()
  }

  connect() {
    let options = {
      peerOpts: {
        trickle: false
      },
      autoUpgrade: false // true
    };
    //this.socket = new SocketP2P(SocketClient(SERVER), options);
    this.socket = SocketClient(SERVER);
    //this.socket.on('ready', () => this.setState({ connected: true }));
    this.socket.on('upgrade', () => this.setState({ connected: 1 }));
    this.socket.on('connect', () => this.setState({ connected: 0 }));

    this.socket.on('activate', (data) => {
      // todo: handle rooms
      this.changeCell(data.x, data.y, true);
    });
    this.socket.on('deactivate', (data) => {
      // todo: handle rooms
      this.changeCell(data.x, data.y, false);
    });
  }

  changeCell(x, y, value) {
    let newGrid = Update(this.state.grid, { [y]: { [x]: { $set: value } } });
    this.setState({ grid: newGrid });
  }

  render() {
    if (this.state.connected < 0) {
      return <div id="load-container">
        <Preloader />
        <h4 className="grey-text">{this.state.connected === -1 ? 'Searching server' : 'Searching peer'}</h4>
      </div>;
    }
    let grid = this.state.grid.map((row, rowIndex) => <div className="grid-row" key={rowIndex}>
      {row.map((cellActive, cellIndex) =>
        <div className={ClassNames('grid-cell', { 'active': cellActive })} key={cellIndex}></div>
      )}
    </div>);
    return <div id="grid-container">
      <div id="grid">{ grid }</div>
    </div>;
  }

  componentDidUpdate() {
    $('.tooltipped').tooltip({delay: 50});
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

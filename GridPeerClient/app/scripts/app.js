import React from 'react'
import ReactDOM from 'react-dom'
import ReactFragment from 'react-addons-create-fragment'

import socket_client from 'socket.io-client'
import socket_p2p from 'socket.io-p2p'

import $ from 'jquery'
import Materialize from 'materialize'

const SERVER = "http://localhost:3000/";

class App extends React.Component {
  constructor() {
    super();

    this.state = { };
  }

  componentWillMount() {

  }

  render() {
    return <h1>Grid Peer Client in React</h1>;
  }

  componentDidUpdate() {
    $('.tooltipped').tooltip({delay: 50});
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

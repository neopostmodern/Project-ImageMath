import React from 'react';
import classNames from 'classnames';

import Drawing from './drawing.js';

export default class Canvas extends React.Component {
  render () {
    return (
      <div id="canvas">
        <Drawing grid={this.props.grid}
                 hoveredCell={this.props.hoveredCell}
                 src='images/img/cheshire-1.jpg'
                 orientation={Drawing.HORIZONTAL}>
        </Drawing>
        <Drawing grid={this.props.grid}
                 hoveredCell={this.props.hoveredCell}
                 src='images/img/fragezeichen.jpg'
                 orientation={Drawing.VERTICAL}>
        </Drawing>
      </div>
    );
  }
}
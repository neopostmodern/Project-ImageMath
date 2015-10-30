import React from 'react';
import classNames from 'classnames';

class ImageSlice extends React.Component {
  render () {
    let props = this.props;
    let {x, y} = props.position;
    let style = {
      backgroundImage: 'url(' + props.src + ')'
    };

    if (props.orientation === Drawing.VERTICAL) {
      Object.assign(style, {
        left: y * 10 + '%',
        backgroundPosition: x * 10 + '%' + ' 0%'
      });
    } else {
      Object.assign(style, {
        top: x * 10 + '%',
        backgroundPosition: '0% ' + y * 10 + '%'
      });
    }

    return <div style={style} className='drawing-slice'></div>;
  }
}

export default class Drawing extends React.Component {
  render () {
    let props = this.props;
    let vertical = this.props.orientation == Drawing.VERTICAL;

    return (
      <div className={classNames("drawing", vertical ? 'vertical' : 'horizontal')}>
        {props.grid.map(function (row, y) {
          return row.map(function (cell, x) {
            let cellHovered = props.hoveredCell
              && props.hoveredCell.x === y // this is the crossed properties!
              && props.hoveredCell.y === x; // no idea why, but it works.
            if (!(cell === 1 || cellHovered)) { // skip inactive cells
              return;
            }

            return <ImageSlice
              key={'d-' + y + '-' + x}
              src={props.src}
              position={{x, y}}
              orientation={props.orientation} />
          });
        })}
      </div>
    );
  }
}

Drawing.VERTICAL = 'vertical';
Drawing.HORIZONTAL = 'horizontal';
import React from 'react';
import classNames from 'classnames';

export default class Drawing extends React.Component {
  render () {
    let props = this.props;
    let vertical = this.props.orientation == Drawing.VERTICAL;

    return (
      <div className={classNames("drawing", vertical ? 'vertical' : 'horizontal')}>
        {props.grid.map(function (row, y) {
          return row.map(function (cell, x) {
            let cellHovered = props.hoveredCell
              && props.hoveredCell.x === x
              && props.hoveredCell.y === y;
            if (!(cell === 1 || cellHovered)) {
              return;
            }

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

            return <div key={'d-' + y + '-' + x}
                        style={style}
                        className='drawing-slice'></div>;
          });
        })}
      </div>
    );
  }
}

Drawing.VERTICAL = 'vertical';
Drawing.HORIZONTAL = 'horizontal';
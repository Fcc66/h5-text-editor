import './index.css';
import { useMemo } from 'react';
import { getStyles } from './util';

function Piece(props) {
  const styles = useMemo(() => getStyles(props.piece.marks), [props.piece.marks]);

  return (
    <span style={ styles }>
      { props.piece.content }
    </span>
  );
}

export default Piece;

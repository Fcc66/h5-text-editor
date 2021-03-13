import './index.css';
import Piece from '../piece';
import { getPieces } from './util';
import { getStyles } from '../piece/util';

function Text(props) {
  const text = props.text;
  const pieces = getPieces(text.children);
  const styles = getStyles(text.marks);

  return (
    <p className="text" style={ styles } id={ text.id }>
      { pieces.map((piece, i) => <Piece key={ piece.id } piece={ piece }></Piece>) }
    </p>
  );
}

export default Text;

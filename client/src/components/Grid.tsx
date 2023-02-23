import { StyledGrid } from "../styles";
import { BsCircle } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

interface IGridProps {
  handleCellOnClick: Function;
  cells: string[][];
}

function Grid({ cells, handleCellOnClick }: IGridProps) {
  const divs: string[] = [];
  cells.forEach((row) =>
    row.forEach((cell) => {
      divs.push(cell);
    })
  );

  return (
    <StyledGrid>
      {divs.map((cell, i) => (
        <div
          key={i}
          className={`_${i}`}
          onClick={() => {
            handleCellOnClick(i);
          }}
        >
          {cell === "o" ? <BsCircle /> : cell === "x" ? <RxCross1 /> : <></>}
        </div>
      ))}
    </StyledGrid>
  );
}

export default Grid;

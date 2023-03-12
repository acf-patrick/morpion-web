import { StyledGrid } from "../styles";
import { BsCircle } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { useMemo } from "react";

interface IGridProps {
  handleCellOnClick: Function;
  cells: string[][];
}

function Grid({ cells, handleCellOnClick }: IGridProps) {
  // Highlighted cells
  const winners = useMemo(() => {
    const winners: Number[] = [];

    for (let i = 0; i < 3; ++i)
      if (cells[i][0] === cells[i][1] && cells[i][1] === cells[i][2])
        for (let j = 0; j < 3; ++j) winners.push(i * 3 + j);

    for (let j = 0; j < 3; ++j)
      if (cells[0][j] === cells[1][j] && cells[1][j] === cells[2][j])
        for (let i = 0; i < 3; ++i) winners.push(i * 3 + j);

    if (cells[0][0] === cells[1][1] && cells[1][1] === cells[2][2])
      for (let i = 0; i < 3; ++i) winners.push(i * 4);

    if (cells[0][2] === cells[1][1] && cells[1][1] === cells[2][0])
      for (let i = 0; i < 3; ++i) winners.push((i + 1) * 2);

    return winners;
  }, [cells]);

  const divs = useMemo(() => {
    const divs: string[] = [];
    cells.forEach((row) =>
      row.forEach((cell) => {
        divs.push(cell);
      })
    );
    return divs;
  }, [cells]);

  return (
    <StyledGrid>
      {divs.map((cell, i) => (
        <div
          key={i}
          className={`_${i} ${(winners.indexOf(i) >= 0) && "highlight"}`}
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

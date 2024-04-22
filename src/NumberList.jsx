import React from 'react';
import { List } from 'react-virtualized';

const NumberList = ({ randomNumbers }) => {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      {index} - {randomNumbers[index]}
    </div>
  );

  return (
    <List
      width={300}
      height={300}
      rowCount={randomNumbers.length}
      rowHeight={20}
      rowRenderer={rowRenderer}
    />
  );
};

export default NumberList;
import React from 'react';

const NumberBlock = ({ number }) => {
  return (
    <div >
      <div style={{backgroundColor:'red'}}>
        {number}
      </div>
    </div>
  );
}

export default NumberBlock;
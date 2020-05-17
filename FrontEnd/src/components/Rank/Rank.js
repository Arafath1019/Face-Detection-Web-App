import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className='white f1 b hover-near-black'>
        {`Welcome! ${name}`}
      </div>
      {/* <div className='white f1'>
        {entries}
      </div> */}
    </div>
  );
}

export default Rank;
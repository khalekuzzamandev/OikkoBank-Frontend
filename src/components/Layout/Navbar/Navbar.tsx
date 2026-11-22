import React from 'react';
import Topbar from './Topbar';

const Navbar = () => {
  return (
    <div className='w-full bg-amber-400'>
      {/* top */}
      <div>
        <Topbar />
      </div>
      {/* down */}
    </div>
  );
};

export default Navbar;
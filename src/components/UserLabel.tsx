
import React from 'react';

type UserLabelProps = {
  username: string;
  color: string;
  position: { x: number; y: number };
};

const UserLabel: React.FC<UserLabelProps> = ({ username, color, position }) => {
  return (
    <div 
      className="user-label" 
      style={{ 
        backgroundColor: color,
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {username}
    </div>
  );
};

export default UserLabel;

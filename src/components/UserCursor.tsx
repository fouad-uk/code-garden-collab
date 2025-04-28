
import React from 'react';
import UserLabel from './UserLabel';

type UserCursorProps = {
  username: string;
  color: string;
  position: { x: number; y: number };
};

const UserCursor: React.FC<UserCursorProps> = ({ username, color, position }) => {
  return (
    <>
      <UserLabel username={username} color={color} position={position} />
      <div
        className="user-cursor"
        style={{
          backgroundColor: color,
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
    </>
  );
};

export default UserCursor;

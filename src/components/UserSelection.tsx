
import React from 'react';

type UserSelectionProps = {
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

const UserSelection: React.FC<UserSelectionProps> = ({ color, position, size }) => {
  return (
    <div
      className="user-selection"
      style={{
        backgroundColor: color,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
    />
  );
};

export default UserSelection;


import { createContext, useContext, useState } from 'react';

type TextSize = 'sm' | 'md' | 'lg';

type TextSizeProviderProps = {
  children: React.ReactNode;
  defaultSize?: TextSize;
  storageKey?: string;
};

type TextSizeProviderState = {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  textSizeClass: string;
};

const getTextSizeClass = (size: TextSize): string => {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-sm';
    case 'lg':
      return 'text-base';
    default:
      return 'text-sm';
  }
};

const initialState: TextSizeProviderState = {
  textSize: 'md',
  setTextSize: () => null,
  textSizeClass: getTextSizeClass('md'),
};

const TextSizeContext = createContext<TextSizeProviderState>(initialState);

export function TextSizeProvider({
  children,
  defaultSize = 'md',
  storageKey = 'ui-text-size',
  ...props
}: TextSizeProviderProps) {
  const [textSize, setTextSize] = useState<TextSize>(
    () => (localStorage.getItem(storageKey) as TextSize) || defaultSize
  );

  const handleSetTextSize = (size: TextSize) => {
    localStorage.setItem(storageKey, size);
    setTextSize(size);
  };

  const value = {
    textSize,
    setTextSize: handleSetTextSize,
    textSizeClass: getTextSizeClass(textSize),
  };

  return (
    <TextSizeContext.Provider {...props} value={value}>
      {children}
    </TextSizeContext.Provider>
  );
}

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (context === undefined)
    throw new Error('useTextSize must be used within a TextSizeProvider');
  return context;
};

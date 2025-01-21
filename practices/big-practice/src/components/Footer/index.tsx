import { memo } from 'react';
import clsx from 'clsx';

interface FooterProps {
  content: string;
  backgroundColor?: string;
}

export const Footer = memo(
  ({
    content,
    backgroundColor = 'bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900',
  }: FooterProps) => {
    const validBackgrounds = [
      'bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900',
      'bg-gray-800',
      'bg-blue-900',
    ];

    return (
      <footer
        className={clsx(
          validBackgrounds.includes(backgroundColor)
            ? backgroundColor
            : 'bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900',
          'text-white shrink-0 h-16 flex items-center justify-center'
        )}
      >
        {content}
      </footer>
    );
  }
);

import React from 'react';
import { render } from '@testing-library/react';
import App from './index';

test('renders learn react link', () => {
  const { container } = render(<App />);
  expect(container.querySelector('canvas')).toBeInTheDocument();
});

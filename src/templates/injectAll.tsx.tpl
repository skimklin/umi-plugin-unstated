import React from 'react';
import { unstatedModels } from '.';

export default ({ children }: { children: React.ReactNode }) => {
  const models = Object.values(unstatedModels);
  if (models.length === 0) return children;

  return models.reduce((prev, Container) => {
    return React.createElement(
      Container.Provider,
      null,
      prev,
    );
  }, children);
}

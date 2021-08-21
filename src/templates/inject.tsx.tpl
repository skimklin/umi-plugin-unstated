import React from 'react';
import { unstatedModels } from './export';

const list = {{{GLOBAL_PROVIDERS}}};

export default ({ children }: { children: React.ReactNode }) => {
  const models = Object.keys(unstatedModels).map(key =>
    list.includes(key) ? unstatedModels[key] : null).filter(Boolean);
  if (models.length === 0) return children;

  return models.reduce((prev, Container) => {
    return React.createElement(
      Container.Provider,
      null,
      prev,
    );
  }, children);
}

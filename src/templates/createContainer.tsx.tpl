import { createContainer } from 'unstated-next';
import models from './models';

export const unstatedModels = models;

export function unstatedContainer<State = unknown, R = unknown>(
  fn: (initialState?: State) => R,
) {
  const Container = createContainer(fn);
  const wrapProvider = (children: React.ReactNode, state?: State) => {
    return (
      <Container.Provider initialState={state}>{children}</Container.Provider>
    )
  }
  return {
    ...Container,
    wrapProvider,
  }
}

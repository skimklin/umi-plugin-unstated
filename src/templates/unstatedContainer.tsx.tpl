import { createContainer } from 'unstated-next';

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

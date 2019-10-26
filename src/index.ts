function insulter(): string {
  return `You're ugly!`;
}

export const doSomething = (): string => {
  const target = "there";
  const message = "hello";
  return [message, target].join(" ");
};

export const doSomethingElse = (): string => {
  const target = "there";
  const message = "hello";
  return [message, target].join(" ");
};

export default insulter;

const a = 123;
const b = 456;

const c = a + b;

export const afunc = (x: number, y: number): number => {
  return x + y;
};

console.log('Hello via Bun!');
console.log(c);
console.log(afunc(1, 2));

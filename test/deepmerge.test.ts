import { deepmerge } from '../src';

test('deep merge', () => {
  const obj1 = {
    name: {
      first: 'a',
      second: 'b',
    },
    age: 12,
  };

  const obj2 = {
    name: {
      second: 'c',
    },
    age: 3,
    package: {
      name: 'cool',
    },
  };

  const result = deepmerge(obj1, obj2);

  expect(result).toEqual({
    name: {
      first: 'a',
      second: 'c',
    },
    age: 3,
    package: {
      name: 'cool',
    },
  });
});

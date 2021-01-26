import { deepmerge } from '../src';

const obj1 = {
  name: {
    first: 'a',
    second: {
      origin: 'origin',
      target: {
        a1: {
          name: 'a1',
        },
      },
    },
  },
  age: 12,
};

const obj2 = {
  name: {
    second: {
      origin: 'origin2',
      target: {
        a1: {
          age: 12,
        },
        a2: {
          name: 'a2',
        },
      },
    },
  },
  age: 3,
  package: {
    name: 'cool',
  },
};

test('deep merge', () => {
  expect(deepmerge(obj1, obj2)).toEqual({
    name: {
      first: 'a',
      second: {
        origin: 'origin2',
        target: {
          a1: {
            name: 'a1',
            age: 12,
          },
          a2: {
            name: 'a2',
          },
        },
      },
    },
    age: 3,
    package: {
      name: 'cool',
    },
  });
});

test('deep merge with unmergeable values', () => {
  expect(deepmerge(obj1, undefined)).toEqual(obj1);
  expect(deepmerge(obj1, null)).toEqual(obj1);
  expect(deepmerge(undefined, obj1)).toEqual(obj1);
  expect(deepmerge(null, obj1)).toEqual(obj1);
  expect(deepmerge(undefined, undefined)).toEqual({});
  expect(deepmerge(null, null)).toEqual({});
});

import { calculateStartupSeq } from '../src/index';

test('Module Loading Sequence', () => {

  // empty test
  expect(calculateStartupSeq([])).toStrictEqual([]);

  // simple dependency check
  expect(calculateStartupSeq([
    { name: "b", dependsOn: ["a"] },
    { name: "a" }
  ])).toStrictEqual([
    { name: "a" },
    { name: "b", dependsOn: ["a"] }
  ]);

  // more dependency check
  expect(calculateStartupSeq([
    { name: "c", dependsOn: ["a", "b"] },
    { name: "b", dependsOn: ["a"] },
    { name: "a" }
  ])).toStrictEqual([
    { name: "a" },
    { name: "b", dependsOn: ["a"] },
    { name: "c", dependsOn: ["a", "b"] }
  ]);

  // fail dependencies
  expect(() => calculateStartupSeq([
    { name: "b", dependsOn: ["a"] },
    { name: "a", dependsOn: ["x"] }
  ])).toThrowError("Unresolved Dependencies for a (missing: x)")

  // fail dependencies
  expect(() => calculateStartupSeq([
    { name: "c", dependsOn: ["b", "x"] },
    { name: "b", dependsOn: ["a"] },
    { name: "a", dependsOn: ["x"] }
  ])).toThrowError("Unresolved Dependencies for c,a (missing: x)")

});

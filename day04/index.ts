#! /usr/bin/env -S deno run --allow-read

const source = Deno.readTextFileSync("./input.txt")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

interface Assignment {
  from: number;
  to: number;
}

const assignments: Array<Array<Assignment>> = source.map((line) => {
  return line
    .split(",")
    .map((part) => part.split("-").map(Number))
    .map(([from, to]) => ({ from, to }));
});

const contains = (first: Assignment, second: Assignment): boolean => {
  return first.from >= second.from && first.to <= second.to;
};

const overlaps = (first: Assignment, second: Assignment): boolean => {
  return (
    (first.from >= second.from && first.from <= second.to) ||
    (first.to >= second.from && first.to <= second.from)
  );
};

// part 1
console.log(
  assignments.filter(
    ([first, second]) => contains(first, second) || contains(second, first)
  ).length
);

// part 2
console.log(
  assignments.filter(([first, second]) => overlaps(first, second) || overlaps(second, first)).length
);

#! /usr/bin/env -S deno run --allow-read

const input = Deno.readTextFileSync("./input.txt").trim().split("");

const containsUniqueCharacters = (array: Array<string>): boolean => {
  const unique = Object.keys(array.reduce((acc, element) => ({ ...acc, [element]: true }), {}));

  return unique.length === array.length;
};

const start = input.findIndex((_, index, array) => index > 3 && containsUniqueCharacters(array.slice(index - 4, index)));
const message = input.findIndex((_, index, array) => index > 13 && containsUniqueCharacters(array.slice(index - 14, index)));

// part 1
console.log(start);

// part 2
console.log(message);
#! /usr/bin/env -S deno run --allow-read

const input = Deno.readTextFileSync("./input.txt").trim().split("");

const containsUniqueCharacters = (array: Array<string>): boolean => {
  const unique = Object.keys(array.reduce((acc, element) => ({ ...acc, [element]: true }), {}));

  return unique.length === array.length;
};

const findFirstUniqueBytePosition = (array: Array<string>, length: number): number => {
  return array.findIndex((_, index, array) => 
    index > (length - 1) && 
    containsUniqueCharacters(array.slice(index - length, index)));
}

const start = findFirstUniqueBytePosition(input, 4);
const message = findFirstUniqueBytePosition(input, 14);

// part 1
console.log(start);

// part 2
console.log(message);
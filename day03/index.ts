#! /usr/bin/env -S deno run --allow-read

// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

const source = Deno.readTextFileSync("./input.txt")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

const computePriority = (letter: string): number => {
  if (letter.toLowerCase() === letter) {
    return letter.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }

  return letter.charCodeAt(0) - "A".charCodeAt(0) + 27;
};

const part1 = source
  .map((line) => [
    line.substring(0, line.length / 2).split(""),
    line.substring(line.length / 2).split(""),
  ])
  .map(([first, second]) => _.intersection(first, second)[0])
  .map((letter) => computePriority(letter))
  .reduce((total, priority) => total + priority);

console.log(part1);

const part2 = _.chunk(source.map(line => line.trim().split("")), 3)
  .map(group => _.intersection(...group)[0])
  .map(letter => computePriority(letter))
  .reduce((total, priority) => total + priority);


console.log(part2);

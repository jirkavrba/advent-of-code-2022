#! /usr/bin/env -S deno run --allow-read

// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

interface Instruction {
  amount: number;
  from: number;
  to: number;
}

type Instructions = Array<Instruction>;
type Cargo = Array<Array<string>>;

const lines = Deno.readTextFileSync("./input.txt").split("\n");

const cargoSource = _.takeWhile(lines, (line) => /^\s*\[/.test(line));

const slots = [...new Array((cargoSource[0].length + 1) / 4)].fill([]);

const cargo: Cargo = cargoSource.reduce((accumulator, line) => {
  const letters = _.chunk(line.split(""), 4).map(([_, letter]) => letter);
  const extended = _.zip(accumulator, letters).map(([stack, letter]) =>
    letter === " " ? stack : [letter].concat(stack)
  );

  return extended;
}, slots);

const instructions: Instructions = _.dropWhile(
  lines,
  (line) => !line.startsWith("move"),
)
  .map((line) => line.replaceAll(/(move|from|to)/g, "").trim())
  .map((line) => line.split(/\s+/).map((part) => Number(part.trim())))
  .map(([amount, from, to]) => ({ amount, from, to }))
  .filter((instruction) =>
    instruction.amount !== undefined &&
    instruction.from !== undefined &&
    instruction.to !== undefined
  );

const resolve = (
  cargo: Cargo,
  instructions: Instructions,
  multiple: boolean, // Lift mutliple crates at once
): Cargo => {
  return instructions.reduce((state, instruction) => {
    const from = instruction.from - 1;
    const to = instruction.to - 1;

    const carry = state[from].slice(-instruction.amount);
    const append = multiple ? carry : [...carry].reverse();

    const remaining = state[from].slice(0, -instruction.amount);
    const appended = state[to].concat(append);

    const updated = state.map((stack, i) => {
      if (i === from) {
        return remaining;
      }

      if (i === to) {
        return appended;
      }

      return stack;
    });

    return updated;
  }, cargo);
};

const output = (cargo: Cargo): string => {
  return cargo.map((stack) => stack.slice(-1)).join("");
}

// part 1
console.log(output(resolve(cargo, instructions, false)));

// part 2
console.log(output(resolve(cargo, instructions, true)));

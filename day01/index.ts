#! /usr/bin/env -S deno run --allow-read

const source = Deno.readTextFileSync("./input.txt");
const elves = source.split("\n\n").map(lines => 
    lines.split("\n")
        .map(line => line.trim())
        .map(line => Number(line))
        .reduce((acc, current) => acc + current, 0)
);

// Part 1
console.log(Math.max.apply(null, elves));

// Part 2
console.log(elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, current) => acc + current, 0));
#! /usr/bin/env -S deno run --allow-read

enum Shape {
  Rock = "rock",
  Paper = "paper",
  Scissors = "scissors",
}

type OpponentSymbol = "A" | "B" | "C";
type PlayerSymbol = "X" | "Y" | "Z";

const opponentMappings: Record<OpponentSymbol, Shape> = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
};

const playerMappings: Record<PlayerSymbol, Shape> = {
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors,
};

interface ParsedLine {
  opponent: Shape;
  player: Shape;
}

const baseScores: Record<Shape, number> = {
  [Shape.Rock]: 1,
  [Shape.Paper]: 2,
  [Shape.Scissors]: 3,
};

const beats: Record<Shape, Shape> = {
    [Shape.Rock]: Shape.Scissors,
    [Shape.Paper]: Shape.Rock,
    [Shape.Scissors]: Shape.Paper,
};

const source = Deno.readTextFileSync("./input.txt")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line) => line.split(/\s+/))
  .map(([opponent, player]): ParsedLine => {
    return {
      opponent: opponentMappings[opponent as OpponentSymbol],
      player: playerMappings[player as PlayerSymbol],
    };
  });

const score = source.reduce((total, {opponent, player}) => {
    const base = baseScores[player];
    // draw
    if (opponent === player) {
        return total + base + 3;
    }

    // win 
    if (beats[player] === opponent) {
        return total + base + 6;
    }

    return total + base;
}, 0);

// Part 1
console.log(score);

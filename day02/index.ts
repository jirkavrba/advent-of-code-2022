#! /usr/bin/env -S deno run --allow-read

enum Shape {
  Rock = "rock",
  Paper = "paper",
  Scissors = "scissors",
}

enum Outcome {
  Draw = "draw",
  Win = "win",
  Lost = "lost",
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

const outcomeMappings: Record<PlayerSymbol, Outcome> = {
  X: Outcome.Lost,
  Y: Outcome.Draw,
  Z: Outcome.Win,
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
  .map((line) => line.split(/\s+/));

const evaluate = (opponent: Shape, player: Shape): number => {
  const base = baseScores[player];
  // draw
  if (opponent === player) {
    return base + 3;
  }

  // win
  if (beats[player] === opponent) {
    return base + 6;
  }

  return base;
};

// Part 1
const part1Score = source
  .map(([opponent, player]): ParsedLine => {
    return {
      opponent: opponentMappings[opponent as OpponentSymbol],
      player: playerMappings[player as PlayerSymbol],
    };
  })
  .reduce(
    (total, { opponent, player }) => total + evaluate(opponent, player),
    0
  );

console.log(part1Score);

// Part 2
const invertedBeats: Record<Shape, Shape> = Object.entries(beats).reduce((acc, [key, value]) => { return {...acc, [value]: key}}, {}) as Record<Shape, Shape>;
const findMatchingShape = (opponent: Shape, outcome: Outcome): Shape => {
  if (outcome === Outcome.Draw) {
    return opponent;
  }

  if (outcome === Outcome.Win) {
    return invertedBeats[opponent];
  }

  return beats[opponent];
};

const part2Score = source
  .map(([opponent, player]): ParsedLine => {
    const outcome = outcomeMappings[player as PlayerSymbol];
    const opponentShape = opponentMappings[opponent as OpponentSymbol];
    const playerShape = findMatchingShape(opponentShape, outcome);

    return {
      opponent: opponentShape,
      player: playerShape,
    };
  })
  .reduce(
    (total, { opponent, player }) => total + evaluate(opponent, player),
    0
  );

console.log(part2Score);

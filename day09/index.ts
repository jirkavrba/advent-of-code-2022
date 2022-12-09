#! /usr/bin/env -S deno run --allow-read

type Position = {
    x: number;
    y: number;
};

type DirectionSymbol = "D" | "U" | "L" | "R";

type Direction = Position;

const directions: Record<DirectionSymbol, Direction> = {
    D: {
        x: 0,
        y: -1,
    },
    U: {
        x: 0,
        y: 1,
    },
    L: {
        x: -1,
        y: 0,
    },
    R: {
        x: 1,
        y: 0,
    },
};

const input = Deno.readTextFileSync("./input.txt")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const moves: Array<Direction> = input
    .map((line) => line.split(" "))
    .flatMap(([symbol, length]) => {
        const direction = directions[symbol as DirectionSymbol];
        const repeated = [].concat(
            ...new Array(Number(length)).fill([direction])
        );

        return repeated;
    });

const start: Position = {
    x: 0,
    y: 0,
};

type State = {
    head: Position;
    tail: Position;
    visited: Set<string>;
};

const initial: State = {
    head: start,
    tail: start,
    visited: new Set(),
};

const move = (origin: Position, direction: Position): Position => {
    return {
        x: origin.x + direction.x,
        y: origin.y + direction.y,
    };
};

const distance = (head: Position, tail: Position): number => {
    return Math.max(Math.abs(head.x - tail.x), Math.abs(head.y - tail.y));
};

const hash = (position: Position): string => {
    return `[${position.x}:${position.y}]`;
}

const result = moves.reduce((state, direction) => {
    const last = state.head;
    const head = move(state.head, direction);
    const tail = distance(head, state.tail) > 1 ? last : state.tail;

    state.visited.add(hash(tail));

    const updated = {
        ...state,
        head,
        tail,
    };

    return updated;
}, initial);

console.log(result.visited.size);

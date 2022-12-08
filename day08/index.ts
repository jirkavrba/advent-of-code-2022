#! /usr/bin/env -S deno run --allow-read

// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

const input = Deno.readTextFileSync("./input.txt")
    .split("\n")
    .map((line) => line.trim().split("").map(Number))
    .filter((line) => line.length > 0);

type Matrix<T> = Array<Array<T>>;

type Position = {
    x: number;
    y: number;
};

const get = <T>(matrix: Matrix<T>, position: Position): T => {
    return matrix[position.y][position.x];
};

const isVisible = (matrix: Matrix<number>, position: Position): boolean => {
    const height = get(matrix, position);

    const row = matrix[position.y];
    const column = matrix.map((row) => row[position.x]);

    const up = column.slice(position.y + 1);
    const down = column.slice(0, position.y);
    const left = row.slice(position.x + 1);
    const right = row.slice(0, position.x);

    return [up, down, left, right].some((trees) =>
        trees.every((tree) => tree < height)
    );
};

const getScenicScore = (matrix: Matrix<number>, position: Position): number => {
    const height = get(matrix, position);

    const row = matrix[position.y];
    const column = matrix.map((row) => row[position.x]);

    const up = column.slice(0, position.y).reverse();
    const down = column.slice(position.y + 1);
    const left = row.slice(0, position.x).reverse();
    const right = row.slice(position.x + 1);

    const filtered = [up, down, left, right].map((trees) => {
        const visible = _.takeWhile(trees, tree => tree < height).length;

        return (visible === trees.length) 
            ? trees.length 
            : visible + 1;
    });

    const score = filtered.reduce((a, b) => a * b);

    return score;
};

// part 1
console.log(
    input.reduce(
        (sum, row, y) =>
            sum +
            row.reduce(
                (sum, _, x) => sum + (isVisible(input, { x, y }) ? 1 : 0),
                0
            ),
        0
    )
);

// part 2
const scores = input.flatMap((row, y) =>
    row.map((_, x) => getScenicScore(input, { x, y }))
);
const best = Math.max.apply(null, scores);

console.log(best);

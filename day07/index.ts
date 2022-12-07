#! /usr/bin/env -S deno run --allow-read

const input = Deno.readTextFileSync("./input.txt")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

class Node {
  constructor(
    readonly path: string,
    readonly name: string,
  ) {}
}

class File extends Node {
  constructor(path: string, name: string, readonly size: number) {
    super(path, name);
  }
}

class Directory extends Node {
  readonly content: Array<File | Directory> = [];

  constructor(path: string, name: string) {
    super(path, name);
  }

  addFile(file: File) {
    this.content.push(file);
  }

  addDirectory(directory: Directory) {
    this.content.push(directory);
  }

  getDirectory(name: string): Directory | undefined {
    return this.content
      .filter((item) => item instanceof Directory)
      .find((item) => item.name === name) as Directory | undefined;
  }

  resolveDirectory(path: string): Directory | undefined {
    const parts = path.split("/").filter((segment) => segment.length > 0);

    if (parts.length === 0) {
      return this;
    }

    const [next, ...remaining] = parts;
    const resolved = this.content.find((item) =>
      item instanceof Directory && item.name === next
    );

    if (!resolved || resolved instanceof File) {
      return undefined;
    }

    return resolved.resolveDirectory(remaining.join("/"));
  }

  get directories(): Array<Directory> {
    return this.content.reduce((directories, item) => {
      if (item instanceof Directory) {
        return [...directories].concat(item.directories);
      }

      return directories;
    }, [this] as Array<Directory>);
  }

  get totalSize(): number {
    return this.content.reduce((total, item) => {
      if (item instanceof File) {
        return total + item.size;
      }

      return total + item.totalSize;
    }, 0);
  }
}

const _printTree = (root: Directory, level = 0): void => {
  console.log(
    `${
      " ".repeat(level * 2)
    } - ${root.name} (dir, total size = ${root.totalSize})`,
  );

  root.content.forEach((item) => {
    if (item instanceof File) {
      console.log(
        `${
          " ".repeat(2 * (level + 1))
        } - ${item.name} (file, size = ${item.size})`,
      );
    } else {
      _printTree(item, level + 1);
    }
  });
};

const parseCommands = (input: Array<string>): Directory => {
  const root = new Directory("", "/");
  const initial = { tree: root, cwd: "" };
  const output = input.reduce(({ tree, cwd }, line) => {
    if (line.startsWith("$ cd ..")) {
      const parts = cwd.split("/");
      const parent = parts.slice(0, -1).join("/");

      return {
        tree,
        cwd: parent,
      };
    }

    if (line.startsWith("$ cd ")) {
      const directory = line.replace("$ cd ", "");

      return {
        tree,
        cwd: cwd + "/" + directory,
      };
    }

    if (!line.startsWith("$ ls")) {
      const current = tree.resolveDirectory(cwd) ?? root;

      if (line.startsWith("dir ")) {
        const name = line.replace("dir ", "");
        const directory = new Directory(cwd, name);

        current.addDirectory(directory);

        return { tree, cwd };
      }

      const [size, name] = line.split(" ");
      const file = new File(cwd, name, Number(size));

      current.addFile(file);

      return { tree, cwd };
    }

    return { tree, cwd };
  }, initial);

  return output.tree;
};

const root = parseCommands(input.slice(1));
const directories = root.directories;

// part 1
console.log(directories.filter(directory => directory.totalSize <= 100_000).reduce((sum, directory) => sum + directory.totalSize, 0));

// part 2
const total = root.totalSize;
const free = 70_000_000 - total;
const required = 30_000_000 - free;

console.log(directories.sort((a, b) => a.totalSize - b.totalSize).find(directory => directory.totalSize >= required)?.totalSize);
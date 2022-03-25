const end = Symbol("end");
interface Tree {
  [char: string]: string | Tree;
  [end]?: typeof end;
}

const insert = (key: string, t: Tree) => {
  const c = key[0];

  if (!c) {
    if (t[end] === end) throw new Error("duplicated key");

    t[end] = end;
    return;
  }

  const rest = key.slice(1);

  const tc = t[c];

  if (tc === undefined) {
    t[c] = rest;
  } else if (typeof tc === "string") {
    const rest0 = tc;
    const tn = {};
    t[c] = tn;
    insert(rest0, tn);
    insert(rest, tn);
  } else {
    insert(rest, tc);
  }
};

const getUniquePrefix = (key: string, t: Tree | string): string => {
  if (typeof t === "string" || !key) return "";
  if (!t) debugger;

  const c = key[0];
  return c + getUniquePrefix(key.slice(1), t[c]);
};

export const generateUniquePrefixes = (ls: string[]) => {
  const tree: Tree = {};

  for (let l of ls) insert(l, tree);

  return ls.map((l) => getUniquePrefix(l, tree));
};

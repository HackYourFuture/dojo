const KB = (n: number): number => {
  return n * 1024;
}

const MB = (n: number): number => {
  return KB(n) * 1024;
}

const GB = (n: number): number => {
  return MB(n) * 1024;
}

export { KB, MB, GB };

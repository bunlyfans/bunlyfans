export interface Color {
  start: string;
  end: string;
  wrap: (str: string) => string;
}

export const colors = {
  reset: map(0, 0),
  green: map(32, 39),
  yellow: map(33, 39),
  blue: map(34, 39),
  grey: map(90, 39),
};

function map(startCode: number, endCode: number): Color {
  const start = `\u001b[${startCode}m`;
  const end = `\u001b[${endCode}m`;

  return {
    start,
    end,
    wrap: (str: string) => `${start}${str}${end}`,
  };
}

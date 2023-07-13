export function timems(start: number) {
  return `${(performance.now() - start).toFixed(3)} ms`;
}

export function durationFormat(seconds: number | string) {
  seconds = Number(seconds);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

// * LowerBound() But O(n) because I'm lazy to do O(log n)
// * Actually, since in Salim Bot has n = 2, this approach is very okay

export function lowerBoundLinear(arr: number[], target: number): number {
  let index = 0;
  while (target >= arr[index]!) index++;
  return index - 1;
}

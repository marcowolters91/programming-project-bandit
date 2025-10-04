export function randomChoice(armsCount) {
  if (typeof armsCount !== 'number' || armsCount <= 0) {
    throw new Error('armsCount must be a positive number');
  }
  return Math.floor(Math.random() * armsCount);
}

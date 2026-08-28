export function shouldLoadReadingBackground({ routeName, lowData }) {
  return routeName === "reader" && !lowData;
}

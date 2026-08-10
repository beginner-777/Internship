export function prefersReducedMotion(mediaQuery: Pick<MediaQueryList, "matches">): boolean {
  return mediaQuery.matches;
}

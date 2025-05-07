export type PathSplitResults = {
  wildcard: string;
  params: Record<string, string>;
  queryParams: Record<string, string | string[]>;
};

/**
 * 
 * - Split the path into route segment and query segment on "?"
  - Split route segment into tokens on "/" - for both route pattern and incoming route
  - If the length of the incoming tokens and the route tokens dont match, AND route doesn't end with "*",
    then NOT a match
  - While iterating, if the next incoming token doesn't match route pattern token AND next route token is NOT "*",
    then NOT a match
  - If the next route pattern token is "*", then rest of the incoming route is "wildcard"
  - If the next route pattern token starts with ":", then next incoming token is positional params
 * 
 * @param routePattern 
 * @param incomingRoute 
 * @returns 
 */
export const getRouteParts = (
  routePattern: string,
  incomingRoute: string
): PathSplitResults | null => {
  const pathSplitResults: PathSplitResults = {
    wildcard: '',
    params: {},
    queryParams: {},
  };

  const incomingPath = incomingRoute.split('?');
  const incomingPathSegments = incomingPath[0]?.split('/');

  const routePatternSegments = routePattern.split('/');

  // If the length of the incoming tokens and the route tokens dont match, AND route doesn't end with "*",
  // then NOT a match
  if (
    routePatternSegments.length !== incomingPathSegments?.length &&
    routePatternSegments[routePatternSegments.length - 1] != '*'
  ) {
    return null;
  }

  for (let index = 0; index < routePatternSegments.length; index++) {
    const routeSegment = routePatternSegments[index];

    // If the next route pattern token is "*", then rest of the incoming route is "wildcard"
    if (routeSegment === '*') {
      pathSplitResults.wildcard = incomingPathSegments?.slice(index).join('/')!;
      continue;
    }

    // If the next route pattern token starts with ":", then next incoming token is positional params
    if (routeSegment?.startsWith(':')) {
      pathSplitResults.params[routeSegment?.split(':')[1]!] =
        incomingPathSegments![index]!;
      continue;
    }

    // If the next incoming token doesn't match route pattern token AND next route token is NOT "*",
    // then NOT a match
    if (
      routeSegment?.toLowerCase() !==
      incomingPathSegments![index]?.toLowerCase()
    ) {
      return null;
    }
  }

  return pathSplitResults;
};

/**
 *
 * @param url Incoming url. Example: http://<host>:port/<url>
 * @param routePatterns Pre configured route patterns
 * @returns Path Split parts
 */
export const routeMiddleware = (
  url: string,
  routePatterns: string[]
): PathSplitResults | null => {
  for (let index = 0; index < routePatterns.length; index++) {
    const routePattern = routePatterns[index]!;

    // Url Pattern -> http://<host>:port/<url>
    const urlSplitted = url.split('/');
    const incomingRoute = '/' + urlSplitted.slice(3).join('/');

    const matchingResult = getRouteParts(routePattern, incomingRoute);

    if (matchingResult) return matchingResult;
  }

  return null;
};

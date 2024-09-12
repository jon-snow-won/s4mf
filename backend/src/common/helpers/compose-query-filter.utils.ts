import { isNumber } from 'class-validator';
import * as qs from 'qs';
import { HelperService } from './helpers.utils';

/**
 * Formats a filter clause by splitting it into a path and a value, and then
 * constructing a formatted filter clause based on whether the value is a number,
 * a boolean string, or a string that needs to be wrapped in a SQL ilike operator.
 *
 * @param {string} filterParam - The filter clause to format, in the format 'path=value'.
 * @return {string} The formatted filter clause.
 */
function formatFilterClause(filterParam: string) {
  const [path, value] = filterParam.split('=');
  const formattedFilterParam =
    isNumber(+value) || HelperService.isBooleanString(value)
      ? `${path}=${value}`
      : `${path}.$ilike=%${value}%`;

  return formattedFilterParam;
}

/**
 * Composes a query filter object from a given filter string.
 *
 * @param {string | undefined} filterBy - The filter string to compose into a query filter object.
 * @return {object | undefined} A query filter object, or undefined if the input filter string is empty or undefined.
 */
export function composeQueryFilter(filterBy: string | undefined) {
  if (!filterBy) {
    return undefined;
  }

  const filtersArray = filterBy.split(',').map((filterParam) => {
    const formattedFilterParam = filterParam
      .replace(/\*/g, '%')
      .split('&')
      .map((filterAndPart) => formatFilterClause(filterAndPart))
      .join('&');

    return qs.parse(formattedFilterParam, { allowDots: true });
  });

  return {
    $or: filtersArray,
  };
}

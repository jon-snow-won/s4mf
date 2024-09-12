import { HelperService } from './helpers.utils';

/**
 * Filters an array of Kubernetes items based on a filter string.
 *
 * The filter string is expected to be in the format of "propertyPath1=value1&propertyPath2=value2,propertyPath3=value3".
 * It supports both AND and OR operations. If the filter string is empty or undefined, the original array is returned.
 *
 * @param {Array<any>} items - The array of Kubernetes items to be filtered.
 * @param {string | undefined} filterString - The filter string.
 * @return {Array<any>} The filtered array of Kubernetes items.
 */
export function filterKubeItems(
  items: Array<any>,
  filterString: string | undefined,
): Array<any> {
  if (!filterString) {
    return items;
  }

  const orFilters = filterString.split(',');

  return items.filter((item) => {
    if (!item) {
      return false;
    }

    return orFilters.some((orFilter) => {
      const andFilters = orFilter.split('&');

      return andFilters.every((andFilter) => {
        const [propertyPath, value] = andFilter.split('=');

        if (!propertyPath || !value) {
          return false;
        }

        const itemPropertyValue = HelperService.get(
          item,
          propertyPath,
        )?.toLowerCase();

        if (!itemPropertyValue) {
          return false;
        }

        return itemPropertyValue.includes(value.toLowerCase());
      });
    });
  });
}

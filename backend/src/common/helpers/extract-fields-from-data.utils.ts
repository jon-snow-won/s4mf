import { HelperService } from './helpers.utils';
import { JSONPath } from 'jsonpath-plus';

const EXCLUDED_FIELDS = ['owner', '_property', '_em'];

/**
 * Processes a given item and extracts the specified fields.
 *
 * @template T - The type of the item.
 * @param {T} item - The item to process.
 * @param {string[]} selectedFields - The fields to extract from the item.
 * @return {Partial<T>} - The formatted item with the extracted fields.
 */
function processDataItem<T>(item: T, selectedFields: string[]) {
  const formattedItem: Partial<T> = {};

  for (const field of selectedFields) {
    if (field.startsWith('$')) {
      const allItems = JSONPath({
        path: field,
        json: item as object,
        resultType: 'all',
      });

      for (const resultItem of allItems) {
        const { path, value } = resultItem;
        if (
          !EXCLUDED_FIELDS.some((excludedField) =>
            path.includes(`['${excludedField}']`),
          )
        ) {
          const setPath = path
            .slice(1)
            .replace(/]\[/g, '.')
            .replace(/\['/g, '')
            .replace(/']/g, '')
            .replace(/'/g, '');
          HelperService.set(formattedItem, setPath, value);
        }
      }
    } else {
      const itemValue = HelperService.get(item as object, field);
      HelperService.set(formattedItem, field, itemValue);
    }
  }

  return formattedItem;
}

/**
 * Extracts fields from the input data based on the requested fields.
 *
 * @param {T[] | T} inputData - The data to extract fields from.
 * @param {string | null | undefined} requestedFields - The fields to extract.
 * @return {Partial<T>[] | Partial<T>} The extracted fields from the input data.
 */
export function extractFieldsFromData<T>(
  inputData: T[] | T,
  requestedFields: string | null | undefined,
): Partial<T>[] | Partial<T> {
  if (!inputData || !requestedFields || requestedFields.length === 0) {
    return inputData;
  }

  const selectedFields = requestedFields
    ? requestedFields
        .trim()
        .split(',')
        .map((field) => field.trim())
    : [];

  if (Array.isArray(inputData)) {
    if (inputData.length === 0) {
      return inputData;
    }

    return inputData.map((item) => {
      return processDataItem(item, selectedFields);
    });
  } else {
    return processDataItem(inputData, selectedFields);
  }
}

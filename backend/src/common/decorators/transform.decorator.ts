import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform(
    (parameters) => {
      switch (parameters.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return parameters.value as boolean;
      }
    },
    {
      toClassOnly: true,
    },
  );
}

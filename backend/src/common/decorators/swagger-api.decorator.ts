import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface SwaggerResponseOptions<T = unknown, K = unknown> {
  operation: string;
  params?: string[];
  notFound?: string;
  badRequest?: string;
  body?: Type<T>;
  response?: Type<K>;
  responseIsArray?: boolean;
}

export function SwaggerResponse(optionsParams: SwaggerResponseOptions) {
  const options: SwaggerResponseOptions = { ...optionsParams };
  const decorators = [ApiOperation({ summary: options.operation })];

  if (options?.params) {
    for (const parameter of options.params) {
      decorators.push(
        ApiParam({ name: parameter, required: true, type: String }),
      );
    }
  }

  if (options?.badRequest) {
    decorators.push(
      ApiResponse({
        status: 400,
        description: options.badRequest,
      }),
    );
  }

  if (options?.notFound) {
    decorators.push(
      ApiResponse({ status: 404, description: options.notFound }),
    );
  }

  if (options?.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  if (options?.response) {
    decorators.push(
      ApiResponse({ type: options.response, isArray: options.responseIsArray }),
    );
  }

  return applyDecorators(...decorators);
}

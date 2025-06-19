import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class WebResponse<T> {
  @ApiProperty()
  data?: T;
  errors?: string;
  paging?: Paging;
  summary?: any;
}

export class Paging {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const ApiWebResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(WebResponse, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(WebResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

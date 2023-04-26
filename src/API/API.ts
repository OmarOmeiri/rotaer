// eslint-disable-next-line no-restricted-imports
import errorHelper from '@/utils/Errors/errorHelper';
import ServerError from '../utils/Errors/ServerError';
import { ContentTypes } from './types';

type url = string;
type reqBody<T extends keyof typeof ContentTypes = 'applicationJson'> =
T extends 'textCss'
  ? string
  : T extends 'textCsv'
    ? string
    : T extends 'textHtml'
      ? string
      : T extends 'textPlain'
        ? string
        : T extends 'textXml'
          ? string
          : T extends 'applicationPdf'
            ? Blob
            : T extends 'applicationJson'
              ? Record<string, unknown>
              : T extends 'applicationXml'
                ? string
                : T extends 'applicationZip'
                  ? Blob
                  : T extends 'applicationXFormUrlencoded'
                    ? Record<string, unknown>
                    : never

export type ApiExternalResponse<T = unknown> = {
  data: T | null
  status: number
}

const responseHandler = () => (
  (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const response: Response = await originalMethod.apply(this, args);
        const resJson = await response.json();
        if (response.ok) {
          return {
            data: resJson,
            status: response.status,
          };
        }
        errorHelper({
          message: resJson.message || 'An unknown error has occured',
          code: resJson.code,
          stack: new Error().stack,
        });
        return {
          data: null,
          status: response.status,
        };
      } catch (err) {
        errorHelper(err);
        return {
          data: null,
          status: err?.response?.data ?? 500,
        };
      }
    };
  }
);

class Api<CT extends keyof typeof ContentTypes> {
  private request: RequestInit = {
    headers: {
      'Content-Type': ContentTypes.applicationJson,
    },
  };

  constructor(
    private url: url,
  ) {
    if (!url.startsWith('http')) {
      this.url = `${process.env.API_URL}/api/${
        this.url
          .replace(/^(\/)?api/, '')
          .replace(/^\//, '')
      }`;
    }
  }

  public body(body: BodyInit): this {
    this.request.body = body;
    return this;
  }

  public params(params: Record<string, unknown>): this {
    this.url = `${
      this.url
    }?${
      new URLSearchParams(
        JSON.parse(
          JSON.stringify(params),
        ) as Record<string, string>,
      ).toString()
    }`;
    return this;
  }

  public config(config: RequestInit): this {
    this.request = {
      ...this.request,
      ...config,
    };
    return this;
  }

  public ContentType(ct: CT): this {
    this.request = {
      ...this.request,
      headers: {
        ...this.request.headers,
        'Content-Type': ContentTypes[ct],
      },
    };
    return this;
  }

  public headers(hd: Record<string, string>): this {
    this.request = {
      ...this.request,
      headers: {
        ...this.request.headers,
        ...hd,
      },
    };
    return this;
  }

  @responseHandler()
  async get<T>(): Promise<ApiExternalResponse<T>> {
    console.log('this.url: ', this.url);
    try {
      return fetch(
        this.url,
        {
          method: 'GET',
          ...this.request,
        },
      ) as unknown as Promise<ApiExternalResponse<T>>;
    } catch (err) {
      errorHelper(err);
      return {
        data: null,
        status: err?.response?.data ?? 500,
      };
    }
  }

  async post<T>(): Promise<ApiExternalResponse<T>> {
    try {
      const res = await fetch(
        this.url,
        {
          method: 'POST',
          ...this.request,
        },
      );

      return {
        data: await res.json(),
        status: res.status,
      };
    } catch (err) {
      errorHelper(err);
      return {
        data: null,
        status: err?.response?.data ?? 500,
      };
    }
  }

  async patch<T>(): Promise<ApiExternalResponse<T>> {
    try {
      const res = await fetch(
        this.url,
        {
          method: 'PATCH',
          ...this.request,
        },
      );

      return {
        data: await res.json(),
        status: res.status,
      };
    } catch (err) {
      errorHelper(err);
      return {
        data: null,
        status: err?.response?.data ?? 500,
      };
    }
  }

  async put<T>(): Promise<ApiExternalResponse<T>> {
    try {
      const res = await fetch(
        this.url,
        {
          method: 'PUT',
          ...this.request,
        },
      );

      return {
        data: await res.json(),
        status: res.status,
      };
    } catch (err) {
      errorHelper(err);
      return {
        data: null,
        status: err?.response?.data ?? 500,
      };
    }
  }

  async delete<T>(): Promise<ApiExternalResponse<T>> {
    try {
      const res = await fetch(
        this.url,
        {
          method: 'PUT',
          ...this.request,
        },
      );

      return {
        data: await res.json(),
        status: res.status,
      };
    } catch (err) {
      errorHelper(err);
      return {
        data: null,
        status: err?.response?.data ?? 500,
      };
    }
  }
}

export default Api;
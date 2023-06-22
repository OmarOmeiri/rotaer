export const MethodsWithBody = [
  'post',
  'put',
  'patch',
] as const;

export const HttpMethodsNoBody = [
  'get',
  'delete',
  'head',
  'options',
] as const;

export const ContentTypes = {
  textCss: 'text/css',
  textCsv: 'text/csv',
  textHtml: 'text/html',
  textPlain: 'text/plain',
  textXml: 'text/xml',
  applicationPdf: 'application/pdf',
  applicationJson: 'application/json',
  applicationXml: 'application/xml',
  applicationZip: 'application/zip',
  applicationXFormUrlencoded: 'application/x-www-form-urlencoded',
};

export type APIError = {
  status: number,
  data: unknown,
  isError: true,
}

export type HTTPOnError = () => string
export type HTTPOnSuccess = () => void

export type WithErrorSuccessFetch<T extends (...args: any) => any> = (
  args: Parameters<T>[number],
  options?: {
    onError?: HTTPOnError,
    onSuccess?: HTTPOnSuccess
  }
  ) => ReturnType<T>

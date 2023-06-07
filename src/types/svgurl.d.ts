type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

declare module '*.svg?url' {
  var url: string;
  export default url;
}
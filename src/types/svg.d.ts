type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

declare module '*.svg' {
  var ReactComponent: SVGComponent;
  export default ReactComponent;
}
type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

declare module '*.svg' {
  const ReactComponent: SVGComponent;
  export default ReactComponent;
}
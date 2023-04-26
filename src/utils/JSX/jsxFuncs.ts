export enum checkJsxChildrenPropertiesRules {
  isEqual = 'isEqual',
  includes = 'includes'
}

/**
 * travels a JSX element children and checks if a given property and a value exists.
 * @param jsx
 * @param property
 * @param value
 * @param rule If set to 'includes' it stops the ieration once it finds a value that includes the "value" param. If set to "isEqual" it searches for an exact match.
 */
export function checkJsxChildrenProperties(jsx: JSX.Element, property: string, value: unknown, rule: checkJsxChildrenPropertiesRules): boolean | void {
  if (jsx) {
    // console.log(jsx);
    if (jsx.props.children && Array.isArray(jsx.props.children)) {
      // eslint-disable-next-line consistent-return
      const recurse = (obj: Record<string, any>): boolean | void => {
        if (Array.isArray(obj?.props?.children)) {
          if (obj?.props?.[property]) {
            if (rule === checkJsxChildrenPropertiesRules.isEqual && obj?.props?.[property] === value) {
              return true;
            }
            if (rule === checkJsxChildrenPropertiesRules.includes && obj?.props?.[property].includes(value)) {
              return true;
            }
          }
          obj.props.children.forEach((c: unknown) => {
            recurse(c as any);
          });
        } else if (rule === checkJsxChildrenPropertiesRules.isEqual) {
          if (property in (obj?.props ?? {}) && obj?.props?.[property] === value) {
            return true;
          }
        } else if (rule === checkJsxChildrenPropertiesRules.includes) {
          if (property in (obj?.props ?? {}) && (obj?.props?.[property] ?? []).includes(value)) {
            return true;
          }
        }
      };
      const children = jsx.props.children.filter((c: Record<string, any>) => c !== null) as Record<string, any>[];
      const childrenLength = children.length;

      for (let i = 0; i < childrenLength; i += 1) {
        const found = recurse(children[i]);
        if (found) {
          return found;
        }
      }
      return false;
    }
    if (jsx.props.children) {
      return false;
    }
    console.warn('jsxFuncs.ts => getJsxChildrenProperties() was incorrectly called. JSX element provided has no children.');
    return undefined;
  }
  console.warn('jsxFuncs.ts => getJsxChildrenProperties() was incorrectly called. JSX element provided has no children.');
  return undefined;
}

/**
 * Conditionally wraps a JSX element.
 * @param condition a boolean. If true adds the wrapper, else returns the children
 * @param children the children to be wrapped
 * @param wrapper the wrapper element
 * @returns
 */
export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean,
  wrapper: (children: JSX.Element) => JSX.Element,
  children: JSX.Element | null,
}): JSX.Element | null => (condition && children ? wrapper(children) : children);


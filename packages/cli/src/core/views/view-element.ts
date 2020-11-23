import stripAnsi from 'strip-ansi';

export type ViewNode = (() => string) | string;
export type ViewElementAttr = (text: string) => string;
export type ViewElementStyles = (text: string) => string;

export interface ViewElement {
  attrs(...attrs: ViewElementAttr[]): ViewElement;
  styles(...styles: ViewElementStyles[]): ViewElement;
  text(): string;
  print(): string;
}

export const createElement = (
  node: ViewNode,
  props: { attrs?: ViewElementAttr[]; styles?: ViewElementStyles[] } = {},
): ViewElement => {
  const print = () => {
    const text = (typeof node === 'string' ? node : node()).replace(/\s/g, ' ');
    return (props.attrs ?? []).concat(props.styles ?? []).reduce((el, attr) => attr(el), text);
  };
  return {
    attrs: (...attrs: ViewElementAttr[]) =>
      createElement(node, { ...props, attrs: [...(props.attrs ?? []), ...attrs] }),
    styles: (...styles: ViewElementStyles[]) =>
      createElement(node, { ...props, styles: [...(props.styles ?? []), ...styles] }),
    text: () => stripAnsi(print()),
    print,
  };
};

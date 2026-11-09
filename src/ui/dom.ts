type Child = Node | string | null | false;

type Listeners = { [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void };

export type ElementOptions = Readonly<{
  className?: string;
  text?: string;
  attrs?: Readonly<Record<string, string | boolean>>;
  on?: Listeners;
}>;

const isChild = (child: Child): child is Node | string => child !== null && child !== false;

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: readonly Child[] = [],
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;

  Object.entries(options.attrs ?? {})
    .filter(([, value]) => value !== false)
    .forEach(([name, value]) => node.setAttribute(name, value === true ? '' : String(value)));

  Object.entries(options.on ?? {}).forEach(([type, listener]) =>
    node.addEventListener(type, listener as EventListener),
  );

  node.append(...children.filter(isChild));
  return node;
};

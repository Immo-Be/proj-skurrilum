export function attachEvent(
  selector: string | NodeListOf<Element> | HTMLElement[],
  event: string,
  fn: (e: Event, elem: Element) => void
) {
  const matches =
    typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;
  if (matches && matches.length) {
    matches.forEach((elem: Element) => {
      elem.addEventListener(event, (e: Event) => fn(e, elem), false);
    });
  }
}

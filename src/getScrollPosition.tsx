let scrollElement: HTMLElement;
scrollElement =
  ((scrollElement = document.documentElement) ||
    (scrollElement = document.body.parentNode as HTMLElement)) &&
  typeof scrollElement.scrollLeft == "number"
    ? scrollElement
    : document.body;

export const getScrollPosition = () => ({
  left: scrollElement.scrollLeft,
  top: scrollElement.scrollTop
});

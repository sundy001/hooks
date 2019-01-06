let scrollElement;
scrollElement =
  ((scrollElement = document.documentElement) ||
    (scrollElement = document.body.parentNode)) &&
  typeof scrollElement.scrollLeft == "number"
    ? scrollElement
    : document.body;

export const getScrollPosition = () => ({
  left: scrollElement.scrollLeft,
  top: scrollElement.scrollTop
});

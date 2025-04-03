var AOS;
if (AOS) {
  AOS.init();
  document.querySelector('body').setAttribute('data-aos-enabled', true);
}

$(function() {
  // refresh animations positions after page was rendered.
  if (AOS) {
    AOS.refresh();
  }
});
var lazyLoadImages = new LazyLoad({
    elements_selector: ".lazy",
    threshold: 500
  });
$(function () {
  var $parent = $('#sb-top-nav-44484bd4-3c2f-4637-8181-6d481173feb7'),
      $navComponent = $parent.closest('.sb-component-simple-top-nav'),
      $nav = $parent.find('.sb-nav__list'),
      $navOpenBtn = $parent.find('.sb-mobile-nav-btn');

  // Function to close the menu
  function closeMenu() {
    $('body').removeClass('is-nav-menu-expanded');
    $navComponent.removeClass('sb-nav--expanded');
  }

  // Function to open the menu
  function openMenu() {
    $('body').addClass('is-nav-menu-expanded');
    $navComponent.addClass('sb-nav--expanded');
  }

  // Toggle menu on hamburger click
  $navOpenBtn.on('click', function (e) {
    e.stopPropagation();
    if ($navComponent.hasClass('sb-nav--expanded')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking outside
  $(document).on('click', function (e) {
    if ($navComponent.hasClass('sb-nav--expanded') && 
        !$(e.target).closest('.sb-top-header__nav').length && 
        !$(e.target).closest('.sb-mobile-nav-btn').length) {
      closeMenu();
    }
  });

  // Close menu when clicking a link
  $nav.on('click', '.sb-link', function () {
    closeMenu();
  });

  // Handle escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $navComponent.hasClass('sb-nav--expanded')) {
      closeMenu();
    }
  });

  // Prevent scrolling when menu is open
  $('body').on('touchmove', function (e) {
    if ($navComponent.hasClass('sb-nav--expanded')) {
      e.preventDefault();
    }
  }, { passive: false });
});
    
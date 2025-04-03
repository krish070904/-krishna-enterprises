$(document).ready(function() {
  var $nav = $('.sb-nav');
  var $vlinks = $('.sb-nav__list');
  var $hlinks = $('.sb-nav__list-hidden');
  var $moreBtn = $('.sb-nav__btn-hidden');
  var navItemsSelector = '> li:not(.sb-nav__btn):not(.sb-nav__list-hidden-trigger):not(.sb-nav__list-hidden)';
  var totalSpace = 0;
  var availableSpace = 0;
  var numOfVisibleItems = 0;
  var numOfItems = 0;
  var breakWidths = [];
  var requiredSpace = 0;
  var prevAvailableSpace = -1;
  var prevNumOfVisibleItems = -1;
  var prevRequiredSpace = -1;
  var btnWidth = 0;
  var extraSpaceForNav = 0;
  var isMoreButtonHidden = true;
  var hasContactCTA = $('> li.sb-nav__btn:last-of-type', $vlinks).length > 0;

  function calculateNavItemsWidth() {
    var totalWidth = 0;
    var items = 0;
    var breakWidthsNew = [];
    
    $(navItemsSelector, $vlinks).each(function() {
      totalWidth += $(this).outerWidth(true);
      breakWidthsNew.push(totalWidth);
      items++;
    });
    
    return [totalWidth, items, breakWidthsNew];
  }

  function restoreHiddenNavItems($hidden, $button) {
    $hidden.children().appendTo($vlinks);
    
    // Reset ex-hidden items styles
    $('> li.sb-nav__item.sb-nav__sub-item', $nav).each(function() {
      $(this).removeClass('sb-nav__sub-item');
      $('.sb-link.sb-nav__sub-link', $(this)).removeClass('sb-nav__sub-link');
    });
  }

  function checkAvailableSpaceForNav() {
    if (availableSpace < 0) {
      availableSpace = undefined;
      restoreHiddenNavItems($hlinks, $moreBtn);
      return;
    }
    
    // Re-calculate nav items' size if needed
    var $firstLink = $(navItemsSelector, $vlinks).first();
    if ($firstLink.length && $firstLink.outerWidth(true) !== breakWidths[0]) {
      restoreHiddenNavItems($hlinks, $moreBtn);
      var sizes = calculateNavItemsWidth();
      totalSpace = sizes[0];
      numOfItems = sizes[1];
      breakWidths = sizes[2];
      numOfVisibleItems = sizes[1];
      checkAvailableSpaceForNav();
    }
    
    var $lastLink = $(navItemsSelector, $vlinks).last();
    var contactButtonWidth = hasContactCTA ? $('> li.sb-nav__btn:last-of-type', $vlinks).last().outerWidth(true) : 0;
    var moreBtnWidth = isMoreButtonHidden ? 0 : btnWidth;
    
    availableSpace = $vlinks.width() - moreBtnWidth - extraSpaceForNav - contactButtonWidth;
    numOfVisibleItems = $(navItemsSelector, $vlinks).length;
    requiredSpace = breakWidths[numOfVisibleItems - 1];

    var $hiddenNavItems = numOfItems - numOfVisibleItems;

    // If there is not enough space
    if (requiredSpace > availableSpace || $hiddenNavItems === 1) {
      $lastLink.addClass('sb-nav__sub-item');
      $('> a', $lastLink).addClass('sb-nav__sub-link');

      if ($('> a', $lastLink).hasClass('sb-button')) {
        $('> a', $lastLink).removeClass('sb-button sb-button--nav').addClass('is-btn sb-nav__link');
      }

      $lastLink.prependTo($hlinks);
      numOfVisibleItems -= 1;
      checkAvailableSpaceForNav();
    // There is more than enough space
    } else if (availableSpace > breakWidths[numOfVisibleItems] && $hiddenNavItems !== 2) {
      var $firstLink = $hlinks.children().first();

      $firstLink.removeClass('sb-nav__sub-item');
      $('> a', $firstLink).removeClass('sb-nav__sub-link');

      if ($('> a', $firstLink).hasClass('is-btn')) {
        $('> a', $firstLink).addClass('sb-button sb-button--nav').removeClass('is-btn sb-nav__link');
      }

      $firstLink.insertBefore($moreBtn);
      numOfVisibleItems += 1;
    }
    
    // Update the button accordingly
    if (numOfVisibleItems === numOfItems) {
      $moreBtn.addClass('is-hidden');
      isMoreButtonHidden = true;
    } else {
      $moreBtn.removeClass('is-hidden');
      if (isMoreButtonHidden) {
        isMoreButtonHidden = false;
        checkAvailableSpaceForNav();
      }
    }

    if (prevAvailableSpace != availableSpace &&
        prevNumOfVisibleItems != numOfVisibleItems &&
        prevRequiredSpace != requiredSpace) {
      prevAvailableSpace = availableSpace;
      prevNumOfVisibleItems = numOfVisibleItems;
      prevRequiredSpace = requiredSpace;
      setTimeout(checkAvailableSpaceForNav, 500);
    }
  }

  var mq = function(query, callback, usePolyfill) {
    var host = {};
    var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;

    if (isMatchMediaSupported) {
      var res = window.matchMedia(query);
      
      callback.apply(host, [res.matches, res.media]);
      
      res.addListener(function(changed) {
        callback.apply(host, [changed.matches, changed.media]);
      });
    }
  };

  mq('(min-width: 1033px)', function(match) {
    if(match) {
      $(window).on('resize.hideNavItems', checkAvailableSpaceForNav);
      checkAvailableSpaceForNav();
    } else {
      $(window).off('resize.hideNavItems');
      $hlinks.children().appendTo($vlinks);
      $('> li:not(.sb-nav__list-hidden) > a.is-btn', $vlinks)
        .addClass('sb-button sb-button--nav').removeClass('is-btn sb-nav__link');
      $('> li.sb-nav__item.sb-nav__sub-item', $nav).each(function() {
        $(this).removeClass('sb-nav__sub-item');
        $('.sb-link.sb-nav__sub-link', $(this)).removeClass('sb-nav__sub-link');
      });
      var $ctaLinks = $('> li.sb-nav__btn', $vlinks);
      $ctaLinks.remove();
      $vlinks.append($ctaLinks);
    }
  });

  mq('(max-width: 767px)', function(match) {
    if($("#sb-id-44484bd4-3c2f-4637-8181-6d481173feb7").hasClass('option-nav-mobile-static') || $("#sb-navigation > .sb-section").hasClass('option-nav-mobile-static')) {
      $("#sb-navigation").addClass("sb-nav--static");
    } else {
      $("#sb-navigation").removeClass("sb-nav--static");
    }
  });
}); 
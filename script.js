<script>
  var __CLIENT_UID__ = "tZAowkkL";
  var __PRODUCT_URL__ = "https://b12.io";

  var targetToScrollTo = null;
  var textToScrollTo = null;
  var hasTextToSelectInUrl = performance.getEntriesByType("navigation")[0].name.includes('#:~:');

  if (hasTextToSelectInUrl) {
    textToScrollTo = decodeURIComponent(performance.getEntriesByType("navigation")[0].name.split('#:~:text=')[1]);
  } else {
    if (window.location.hash.search('UL_FORM') == -1 && window.location.hash.search('#!') == -1) {
      targetToScrollTo = window.location.hash.replace('#', '');

      // Stop browser from jumping to a selected section (we scroll manually in the nav).
      var isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
      if (isIE) {
        window.location.hash = '';
        history.replaceState(null, null, window.location.href.split('#')[0]);
      } else {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      } 
    }
  }

  $(function () {
    var $parent = $('#sb-top-nav-44484bd4-3c2f-4637-8181-6d481173feb7'),
        $navComponent = $parent.closest('.sb-component-simple-top-nav'),
        $nav = $parent.find('.sb-nav__list'),
        $navOpenBtn = $parent.find('.sb-mobile-nav-btn'),
        $navCloseBtn = $parent.find('.sb-nav__close'),
        $subNavToggleBtn = $parent.find('.sb-nav__sub-toggle'),
        $navigationWrapper = $("#sb-navigation"),
        $bannerWrapper = $("#sb-banner"),
        $navigationSection = $("#sb-navigation > .sb-section");

    // Fix for when animations are applied
    $navigationWrapper.find('.sb-section').css('transform', 'none');

    // Mobile nav open
    $navOpenBtn.on('click', function () {
      $('body').toggleClass('is-nav-menu-expanded');
      $navComponent.toggleClass('sb-nav--expanded');
    });

    // Mobile nav close
    $navCloseBtn.on('click', function () {
      $('body').toggleClass('is-nav-menu-expanded');
      $navComponent.toggleClass('sb-nav--expanded');
    });

    // Submenu toggle
    $subNavToggleBtn.on('click', function (e) {
      e.stopImmediatePropagation();
      $(this).closest('li').toggleClass('is-sub-visible');
    });

    // Close nav on link click
    $nav.on('click', '.sb-link', function () {
      $navComponent.removeClass('sb-nav--expanded');
    });

    function toggleFixedNavigation () {
      $navigationSection = $("#sb-navigation > .sb-section");
      if ($("#sb-id-44484bd4-3c2f-4637-8181-6d481173feb7").hasClass("option-nav-fixed") || $navigationSection.hasClass("option-nav-fixed")) {
        var $bannerSection = $("#sb-banner > .sb-section");

        if ($(window).scrollTop() > 0) {
          $navigationWrapper.addClass("sb-nav--fixed");

          var bannerOuterHeight = 0;
          if ($bannerSection.length > 0 && $("body").hasClass("is-banner-in")) {
            bannerOuterHeight = $bannerSection.outerHeight();
            $navigationSection.css('top', bannerOuterHeight + 'px');
          }

          if(!$navigationSection.hasClass('option-nav-overlay')) {
            $('body').css('padding-top', $navigationWrapper.outerHeight() + bannerOuterHeight + 'px');
          }
        } else {
          $navigationWrapper.removeClass("sb-nav--fixed");

          if ($bannerSection.length > 0) {
            $navigationSection.css('top', '0px');
          }

          if ($bannerSection.length > 0 && $("body").hasClass("is-banner-in")) {
            $('body').css('padding-top', $bannerSection.outerHeight() + 'px');
          } else {
            $('body').css('padding-top', '0px');
          }
        }
      }
    }

    // Adjust hero padding if nav is overlayed
    function adjustHeroPadding() {
      if (!$navigationSection.hasClass('option-nav-overlay')) return;

      const $firstHero = $('#sb-page-structure > section:first');
      if (!$firstHero.hasClass('option-section-hero')) {
        $navigationSection.removeClass('option-nav-overlay');
        $('body').removeClass('has-overlay-nav');
      } else {
        const navHeight = $navigationSection.outerHeight();
        const topPadding = navHeight + 20;
        $firstHero.css('paddingTop', `${topPadding}px`);
      }
    }

    adjustHeroPadding();

    $(window).scroll(function() {
      toggleFixedNavigation();
    });

    $(window).resize(function() {
      setTimeout(function() {
        adjustHeroPadding();
        toggleFixedNavigation();
        // Properly hide banner on window resize
        if (!$navigationSection.hasClass("option-nav-fixed") && $('body').hasClass('is-banner-out')) {
          var $bannerSection = $("#sb-banner");
          $bannerSection.css('margin-top', '-' + $bannerSection.outerHeight() + 'px');
        }
      }, 200);
    });

    // Scroll spy logic
    var lastId,
        topMenu = $('#sb-nav-44484bd4-3c2f-4637-8181-6d481173feb7'),
        topMenuHeight = $('#sb-navigation > section').outerHeight(),
        menuItems,
        scrollItems,
        defaultActive = topMenu.find('li.active'),
        pagePath = window.location.pathname.split("/").pop(),
        menuSelector = pagePath === '' ? 'index' : pagePath,
        scrollSpyInitialized = false;

    $(window).scroll(function () {
      if (!scrollSpyInitialized) {
        menuItems = topMenu.find('a[href^="' + menuSelector + '#"]');
        scrollItems = menuItems.map(function () {
          var item = $($(this).attr("href").replace(menuSelector, ''));
          if (item.length > 0) { return item; }
        });
        scrollSpyInitialized = true;
      }
      var fromTop = $(this).scrollTop() + topMenuHeight;
      var cur = scrollItems.map(function () {
        if ($(this).offset().top <= fromTop) {
          return this;
        }
      });
      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";

      if (lastId !== id) {
        lastId = id;
        if ('' == lastId && '' == id) {
          defaultActive.addClass('active');
        } else {
          topMenu.find('li').removeClass('active');
        }
        menuItems
          .parent().removeClass("active")
          .end().filter("[href='" + menuSelector + "#" + id + "']").parent().addClass("active");
      }
    });

    function scrollSmoothlyTo(elem) {
      if (elem.length === 0) {
        return;
      }
      $('html, body').animate({
        scrollTop: (elem.offset().top - topMenuHeight + 10) + 'px'
      }, 1500);
    }

    // Smooth scroll on page load
    $(function () {
      if (targetToScrollTo) {
        setTimeout(function () {
          const hash = `#${targetToScrollTo}`;
          scrollSmoothlyTo($(hash));
          const url = new URL(window.location);
          url.hash = hash;
          history.pushState(null, null, url);
        }, 300);
      }
    });

    // Restore hidden nav items
    function restoreHiddenNavItems($hiddenItems, $moreBtn) {
      $hiddenItems.children().each(function () {
        var $this = $(this);
        $this.removeClass('sb-nav__sub-item');
        $('> a', $this).removeClass('sb-nav__sub-link');
        if ($('> a', $this).hasClass('is-btn')) {
          $('> a', $this).addClass('sb-button sb-button--nav').removeClass('is-btn sb-nav__link');
        }
        $this.insertBefore($moreBtn);
      });
    }

    // Smooth scroll to section on nav link click
    var $navLinks = $('.sb-link', $nav);
    pagePath = window.location.pathname.split("/").pop();

    $navLinks.on('click', function (e) {
      var $this = $(this),
          url = $this.attr('href'),
          hash = url.split('#')[1],
          targetPath = e.target.pathname.split("/").pop(),
          isExternal = $this.hasClass('is-external');

      if (!isExternal) {
        if ('index' != targetPath && targetPath != pagePath) {
          return;
        }
        if (hash) {
          if ((pagePath == targetPath) || ('index' == targetPath && '' == pagePath)) {
            e.preventDefault();
            scrollSmoothlyTo($('#' + hash));
            history.pushState(null, null, targetPath + '#' + hash);
          }
        } else {
          if (('index' == targetPath && 'index' == pagePath) || ('index' == targetPath && '' == pagePath)) {
            e.preventDefault();
            scrollSmoothlyTo($('body'));
            history.pushState(null, null, targetPath);
          }
        }
      }
    });

    $('.sb-top-header__brand').on('click', function (e) {
      if ('' == pagePath || 'index' == pagePath || 'index.html' == pagePath) {
        e.preventDefault();
        history.pushState(null, null, window.location.pathname);
        $('html, body').animate({ scrollTop: 0 }, 1500);
      }
    });

    // Hide nav items if no space
    var $vlinks = $nav,
        $hlinks = $parent.find('.sb-nav__list-hidden-links'),
        $moreBtn = $parent.find('.sb-nav__list-hidden'),
        btnWidth = $moreBtn.outerWidth(true),
        isMoreButtonHidden = true,
        numOfItems = 0,
        totalSpace = 0,
        breakWidths = [],
        extraSpaceForNav = 30,
        hasContactCTA = false,
        navItemsSelector = '> li:not(.sb-nav__list-hidden)';

    var $navItems = $(navItemsSelector, $vlinks);
    if ($navItems.last().hasClass('sb-nav__btn')) {
      hasContactCTA = true;
      navItemsSelector += ':not(:last-child)';
    }

    if (hasContactCTA) {
      $moreBtn.insertBefore($navItems.last());
    }

    function calculateNavItemsWidth () {
      var totalSpace = 0,
          numOfItems = 0,
          breakWidths = [];
      $(navItemsSelector, $vlinks).outerWidth(function(i, w) {
        totalSpace += $(this).outerWidth(true);
        numOfItems += 1;
        breakWidths.push(totalSpace);
      });
      return [totalSpace, numOfItems, breakWidths];
    }

    [totalSpace, numOfItems, breakWidths] = calculateNavItemsWidth();

    var availableSpace, numOfVisibleItems, requiredSpace;
    var prevAvailableSpace, prevNumOfVisibleItems, prevRequiredSpace;

    function checkAvailableSpaceForNav() {
      if (availableSpace < 0) {
        availableSpace = undefined;
        restoreHiddenNavItems($hlinks, $moreBtn);
        return;
      }
      var $firstLink = $(navItemsSelector, $vlinks).first();
      if ($firstLink.length && $firstLink.outerWidth(true) !== breakWidths[0]) {
        restoreHiddenNavItems($hlinks, $moreBtn);
        var sizes = calculateNavItemsWidth();
        totalSpace = sizes[0];
        numOfItems = sizes[1];
        breakWidths = sizes[2];
        numOfVisibleItems  = sizes[1];
        checkAvailableSpaceForNav();
      }
      var $lastLink = $(navItemsSelector, $vlinks).last();
      var contactButtonWidth = hasContactCTA ? $('> li.sb-nav__btn:last-of-type', $vlinks).last().outerWidth(true) : 0;
      var moreBtnWidth = isMoreButtonHidden ? 0 : btnWidth;
      availableSpace = $vlinks.width() - moreBtnWidth - extraSpaceForNav - contactButtonWidth;
      numOfVisibleItems = $(navItemsSelector, $vlinks).length;
      requiredSpace = breakWidths[numOfVisibleItems - 1];

      var $hiddenNavItems = numOfItems - numOfVisibleItems;
      if (requiredSpace > availableSpace || $hiddenNavItems === 1) {
        $lastLink.addClass('sb-nav__sub-item');
        $('> a', $lastLink).addClass('sb-nav__sub-link');
        if ($('> a', $lastLink).hasClass('sb-button')) {
          $('> a', $lastLink).removeClass('sb-button sb-button--nav').addClass('is-btn sb-nav__link');
        }
        $lastLink.prependTo($hlinks);
        numOfVisibleItems -= 1;
        checkAvailableSpaceForNav();
      } else if (availableSpace > breakWidths[numOfVisibleItems] && $hiddenNavItems !== 2) {
        var $firstHidden = $hlinks.children().first();
        $firstHidden.removeClass('sb-nav__sub-item');
        $('> a', $firstHidden).removeClass('sb-nav__sub-link');
        if ($('> a', $firstHidden).hasClass('is-btn')) {
          $('> a', $firstHidden).addClass('sb-button sb-button--nav').removeClass('is-btn sb-nav__link');
        }
        $firstHidden.insertBefore($moreBtn);
        numOfVisibleItems += 1;
      }

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

      if (
        prevAvailableSpace != availableSpace &&
        prevNumOfVisibleItems != numOfVisibleItems &&
        prevRequiredSpace != requiredSpace
      ) {
        prevAvailableSpace = availableSpace;
        prevNumOfVisibleItems = numOfVisibleItems;
        prevRequiredSpace = requiredSpace;
        setTimeout(checkAvailableSpaceForNav, 500);
      }
    }

    // Media queries
    var mq = function (query, callback, usePolyfill) {
      var host = {};
      var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;

      if (isMatchMediaSupported) {
        var res = window.matchMedia(query);
        callback.apply(host, [res.matches, res.media]);
        res.addListener(function (changed) {
          callback.apply(host, [changed.matches, changed.media]);
        });
      }
    };

    mq('(min-width: 1033px)', function (match) {
      if (match) {
        $(window).on('resize.hideNavItems', function() {
          checkAvailableSpaceForNav();
        });
        checkAvailableSpaceForNav();
      } else {
        $(window).off('resize.hideNavItems');
        $hlinks.children().appendTo($vlinks);
        $('> li:not(.sb-nav__list-hidden) > a.is-btn', $vlinks)
          .addClass('sb-button sb-button--nav')
          .removeClass('is-btn sb-nav__link');
        // Reset ex-hidden items
        $('> li.sb-nav__item.sb-nav__sub-item', $nav).each((index, item) => {
          $(item).removeClass('sb-nav__sub-item');
          $('.sb-link.sb-nav__sub-link', $(item)).removeClass('sb-nav__sub-link');
        });
        // Add all CTAs to the bottom
        var $ctaLinks = $('> li.sb-nav__btn', $vlinks);
        $ctaLinks.remove();
        $vlinks.append($ctaLinks);
      }
    });

    mq('(max-width: 767px)', function (match) {
      if (
        $("#sb-id-44484bd4-3c2f-4637-8181-6d481173feb7").hasClass('option-nav-mobile-static') ||
        $("#sb-navigation > .sb-section").hasClass('option-nav-mobile-static')
      ) {
        $("#sb-navigation").addClass("sb-nav--static");
      } else {
        $("#sb-navigation").removeClass("sb-nav--static");
      }
    });
  });


  // Another jQuery block for certain text-image float logic
  $(function() {
    var $elem = $('[data-sb-uuid="a5d34deb-afee-4687-ad13-fae10804f656"]'),
        $section = $elem.closest('.sb-section'),
        hasProperClass = !!($section.hasClass('option-text-image-float-left') || $section.hasClass('option-text-image-float-right'));

    mq('(min-width: 767px)', function (match) {
      if (match && hasProperClass) {
        $elem.find('.option-image').prependTo($section);
      } else {
        $section.find('.option-image').prependTo($elem.find('.sb-text-image__image'));
      }
    });

    function mq(query, callback, usePolyfill) {
      var host = {};
      var isMatchMediaSupported = !!(window && window.matchMedia) && !usePolyfill;

      if (isMatchMediaSupported) {
        var res = window.matchMedia(query);
        callback.apply(host, [res.matches, res.media]);
        res.addListener(function (changed) {
          callback.apply(host, [changed.matches, changed.media]);
        });
      }
    }
  });

  // AOS animations
  var AOS;
  if (AOS) {
    AOS.init();
    document.querySelector('body').setAttribute('data-aos-enabled', true);
  }

  $(function() {
    if (AOS) {
      AOS.refresh();
    }
  });

  // LazyLoad
  var lazyLoadImages = new LazyLoad({
    elements_selector: ".lazy",
    threshold: 500
  });

  // B12 popup/banner
  $(document).ready(function() {
    if (window.b12) {
      if (window.b12.popup) {
        window.b12.popup.init();
      }
      if (window.b12.banner) {
        window.b12.banner.init();
      }
    }
  });

  // Load B12 traffic script
  !function(b12){
    var e=b12.createElement("script"),
        t=b12.getElementsByTagName("script")[0];
    e.async=1;
    e.src="//cdn.b12.io/prod_traffic/global.js";
    t.parentNode.insertBefore(e,t);
  }(document);

  // B12 toast
  window.addEventListener('load', () => {
    const { toastMessage } = window.b12?.nextSteps.parseUrlParams() || {};
    if (window.b12 && toastMessage) {
      window.b12.toastNotification.show(toastMessage);
    }
  });

  // Lightbox
  $(function() {
    b12.deferredRun("lightbox.runModal", {
      "className": ".quick-view-0171b83f-16f5-4f68-81a5-9995b3827dc8",
      "classForTriggers": ".quick-view-0171b83f-16f5-4f68-81a5-9995b3827dc8-trigger",
      "sectionClasses": [
        "option-imagesize-lg",
        "option-imagecrop-square",
        "option-link-decoration-border-bottom-static",
        "option-animate-image-fade",
        "option-grid-align-default",
        "option-section-background-image-fixed",
        "option-columns-4col",
        "option-align-content-left"
      ],
      "uuid": "0171b83f-16f5-4f68-81a5-9995b3827dc8"
    });

    b12.deferredRun("lightbox.runModal", {
      "className": ".quick-view-e4eaf513-9965-4eee-903c-de5779127c16",
      "classForTriggers": ".quick-view-e4eaf513-9965-4eee-903c-de5779127c16-trigger",
      "sectionClasses": [
        "option-imagesize-lg",
        "option-imagecrop-square",
        "option-link-decoration-border-bottom-static",
        "option-animate-image-fade",
        "option-grid-align-default",
        "option-section-background-image-fixed",
        "option-columns-4col",
        "option-align-content-left"
      ],
      "uuid": "e4eaf513-9965-4eee-903c-de5779127c16"
    });

    b12.deferredRun("lightbox.run", {
      "className": ".quick-view-a5a09eac-e4dc-466a-98c4-e24272805011",
      "classForVideo": ".quick-view-a5a09eac-e4dc-466a-98c4-e24272805011 .sb-video-thumbnail",
      "youTubeThumbResolution": "maxresdefault",
      "sectionClasses": [
        "option-imagesize-lg",
        "option-columns-3col",
        "option-link-decoration-border-bottom-static",
        "option-imagecrop-square",
        "option-grid-align-default",
        "option-section-background-image-fixed"
      ]
    });
  });
</script>

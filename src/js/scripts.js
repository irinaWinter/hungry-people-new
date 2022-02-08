(function () {
  const
    html = document.querySelector('html');

  const
    body = document.querySelector('body');

  const
    main = document.querySelector('main');

  const
    showOverflowY = () => {
      html.style.overflowY = 'visible';
    }

  const
    hideOverflowY = () => {
      html.style.overflowY = 'hidden';
    }



  // Preload
  body.classList.remove('preload');


  // Swiper
  const
    swiper = new Swiper(".swiper", {
      autoplay: {
        delay: 3000,
      },
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

  // Map
  const
    yandexMap = document.querySelector('#map');

  if (yandexMap) {
    let
      executed = false;

    document.addEventListener('scroll', function () {
      if (executed == false && elementInViewport(yandexMap)) {
        showMap(yandexMap);
        executed = true;
      }
    });

    if (elementInViewport(yandexMap)) {
      if (executed == false && elementInViewport(yandexMap)) {
        setTimeout(function () {
          showMap(yandexMap);
          executed = true;
        }, 1000)
      }
    }
  }

  function elementInViewport(el) {
    let
      top = el.offsetTop;

    let
      left = el.offsetLeft;

    let
      width = el.offsetWidth;

    let
      height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }

  function showMap(yandexMap) {
    let
      mapInitialised = false;

    if (!document.querySelector('script[src="https://api-maps.yandex.ru/2.1/?lang=en_US"]')) {
      let
        scriptYMap = document.createElement('script');

      let
        body = document.querySelector('body');

      scriptYMap.src = 'https://api-maps.yandex.ru/2.1/?lang=en_US';
      body.append(scriptYMap);

      scriptYMap.onload = function (event) {
        ymaps.ready(mapInit);
        mapInitialised = true;
      }

    } else {
      if ((yandexMap.childNodes.length < 1) && (mapInitialised = false)) {
        mapInit();
      }
    }
  }

  function mapInit() {
    const
      center = [51.499252, -0.100410];

    const
      myMap = new ymaps.Map("map", {
        center: center,
        zoom: 14
      }, {
        searchControlProvider: "yandex#search"
      }),

      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        "<div style='color: #FFFFFF; font-weight: bold;'>$[properties.iconContent]</div>"
      ),

      myPlacemark = new ymaps.Placemark([51.499252, -0.100410], {
        hintContent: "5th London Boulevard, U.K.",
      }, {
        iconLayout: "default#image",
        iconImageHref: "https://irinawinter.github.io/hungry-people-new/build/img/logo.svg",
        iconImageSize: [60, 60],
        iconImageOffset: [-30, -30]
      })

    myMap.geoObjects.add(myPlacemark);
    myMap.controls.remove('searchControl');
  }


  // Categories
  const
    content = document.querySelectorAll('.tabs-content__item');

  const
    hideContent = () => {
      content.forEach(item => item.classList.add('hidden'));
    }

  hideContent();

  const
    switches = document.querySelector('.switches');

  const
    swithcesList = switches.querySelectorAll('.switches__radio');

  const
    getCurrentCategory = () => {
      for (const item of swithcesList) {
        if (item.checked) return item.getAttribute('data-value')
      }
    }

  const
    showCurrentCategory = (currentСategory) => {
      for (const item of content) {
        if (item.getAttribute("data-content") === currentСategory) {
          item.classList.remove('hidden')
        }
      }
    }

  showCurrentCategory(getCurrentCategory())

  const
    parentElementIsSwitch = function (evt) {
      return evt.target.parentElement.classList.contains('switches__item');
    }

  const
    switchesClickHandler = function (evt) {
      if (parentElementIsSwitch(evt)) {
        hideContent();

        const
          currentСategory = evt.target.parentElement.querySelector('.switches__radio').getAttribute("data-value");

        showCurrentCategory(currentСategory)
      }
    }

  switches.addEventListener('click', function (evt) {
    switchesClickHandler(evt)
  })


  // Scroll menu
  const
    anchors = document.querySelectorAll('a[href*="#"]')

  const
    ahchorClickHandler = function (evt, anchor) {
      const
        name = anchor.getAttribute('href').substr(1);

      const
        blockName = '[id=' + name + ']';

      let
        targetBlock;

      if (blockName.length > 5) {
        targetBlock = document.querySelector(blockName)
      }

      if (targetBlock) {
        evt.preventDefault()
        closeMenu();

        targetBlock.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }

  anchors.forEach(anchor => anchor.addEventListener('click', (evt) => {
    ahchorClickHandler(evt, anchor)
  }))


  // Mobile menu
  const
    openMenuButton = document.querySelector('.burger');

  const
    mobileMenu = document.querySelector('.page-header__mobile-menu');

  function closeMenu() {
    mobileMenu.classList.remove('page-header__mobile-menu--active');
    showOverflowY()
  }

  function openMenu() {
    mobileMenu.classList.add('page-header__mobile-menu--active');
    hideOverflowY()
  }

  if (openMenuButton) {
    const
      toggleMenu = () => {
        if (mobileMenu.classList.contains('page-header__mobile-menu--active')) {
          closeMenu()
        } else {
          openMenu()
        }
      };

    const
      openMenuButtonClickHandler = () => {
        toggleMenu();
      }

    openMenuButton.addEventListener('click', openMenuButtonClickHandler);
  }


  // Success message
  const
    successMessageTemplate = document.querySelector('#success');

  const
    successMessagePopup = successMessageTemplate
      .content
      .querySelector('.popup__container')
      .cloneNode(true);

  const
    closeSuccessMessage = () => {
      successMessagePopup.remove();
      showOverflowY();
    };

  const
    openSuccessMessage = () => {
      hideOverflowY()

      main.appendChild(successMessagePopup);

      const
        closeButtonTop = document.querySelector('.popup__close-button');

      closeButtonTop.addEventListener('click', closeSuccessMessage);

      const
        popup = document.querySelector('.popup__container')

      popup.addEventListener('click', function (evt) {
        if (evt.target === popup) closeSuccessMessage()
      })
    }

  const
    disable = (field) => {
      field.disabled = true
    }

  const
    forms = document.querySelectorAll('.form')

  const
    disableFields = (form) => {
      const
        fields = form.querySelectorAll('input')

      fields.forEach(field => disable(field))

      const
        textareas = form.querySelectorAll('textarea')

      textareas.forEach(textarea => disable(textarea))

      const
        submitButtons = form.querySelectorAll('button[type="submit"]')

      submitButtons.forEach(button => disable(button))
    }

  forms.forEach(form => form.addEventListener('submit', function (evt) {
    evt.preventDefault()
    disableFields(form);
    openSuccessMessage();
  }))


  // Parallax
  const
    scenes = document.querySelectorAll('.parallax');

  scenes.forEach(scene => {
    const
      parallaxInstance = new Parallax(scene);
  })


  // Inputmask
  const
    im = new Inputmask('8(999)-999-99-99');

  const
    telFields = document.querySelectorAll('input[type="tel"]')

  telFields.forEach(field => im.mask(field))


  // Scroll
  function scrollTrigger(selector, options = {}) {
    let
      els = document.querySelectorAll(selector)

    els = Array.from(els)

    els.forEach(el => {
      addObserver(el, options)
    })
  }

  function addObserver(el, options) {
    if (!('IntersectionObserver' in window)) {
      if (options.cb) {
        options.cb(el)
      } else {
        entry.target.classList.add('scrll-active')
      }

      return
    }

    let
      observer = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (options.cb) {
              options.cb(el)
            } else {
              entry.target.classList.add('scrll-active')
            }
            observer.unobserve(entry.target)
          }
        })
      }, options)

    observer.observe(el)
  }

  const
    scrollElems = document.querySelectorAll('.scroll-reveal')

  scrollElems.forEach((item, i) => {
    item.classList.add('scrll-box')

    if (i % 2) {
      item.classList.add('scrll-left')
    } else {
      item.classList.add('scrll-right')
    }
  })

  scrollTrigger('.scroll-reveal')


  // Top Button
  const
    topButton = document.querySelector('.top-button');

  function trackScroll() {
    const
      scrolled = window.pageYOffset;

    const
      coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      topButton.classList.add('top-button--visible');
    }

    if (scrolled < coords) {
      topButton.classList.remove('top-button--visible');
    }
  }

  window.addEventListener('scroll', trackScroll);
})();

(function () {
  const
    html = document.querySelector('html');

  const
    main = document.querySelector('main');

  // Preload
  const
    body = document.querySelector('body');

  body.classList.remove('preload');


  // Swiper
  const
    swiper = new Swiper(".swiper", {
      autoplay: {
        delay: 3000,
      },
      autoHeight: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });


  // Map
  let
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
    var
      top = el.offsetTop;
    var
      left = el.offsetLeft;
    var
      width = el.offsetWidth;
    var
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
    var
      center = [51.499252, -0.100410];

    var
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
        iconImageHref: "../img/logo.svg",
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
  const anchors = document.querySelectorAll('a[href*="#"]')

  for (let anchor of anchors) {
    anchor.addEventListener('click', function (evt) {

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

    })
  }

  // Mobile menu
  var openMenuButton = document.querySelector('.burger');

  function closeMenu() {
    mobileMenu.classList.remove('page-header__mobile-menu--active');
    html.style.overflowY = 'visible';
  }

  function openMenu() {
    mobileMenu.classList.add('page-header__mobile-menu--active');
    html.style.overflow = 'hidden';
  }

  if (openMenuButton) {
    var mobileMenu = document.querySelector('.page-header__mobile-menu');

    var toggleMenu = () => {
      if (mobileMenu.classList.contains('page-header__mobile-menu--active')) {
        closeMenu()
      } else {
        openMenu()
      }
    };

    var openMenuButtonClickHandler = () => {
      toggleMenu();
    }

    openMenuButton.addEventListener('click', openMenuButtonClickHandler);
  }

  // Success message
  const successMessageTemplate = document.querySelector('#success');
  const successMessagePopup = successMessageTemplate
    .content
    .querySelector('.popup__container')
    .cloneNode(true);

  const closeSuccessMessage = () => {
    successMessagePopup.remove();
    html.style.overflowY = 'visible';
  };

  const openSuccessMessage = () => {
    html.style.overflowY = 'hidden';

    main.appendChild(successMessagePopup);

    const closeButtonTop = document.querySelector('.popup__close-button');

    closeButtonTop.addEventListener('click', closeSuccessMessage);

    const popup = document.querySelector('.popup__container')

    popup.addEventListener('click', function (evt) {
      if (evt.target === popup) closeSuccessMessage()
    })
  }

  const disable = (field) => {
    field.disabled = true
  }

  const forms = document.querySelectorAll('.form')
  forms.forEach(item => item.addEventListener('submit', function (evt) {
    evt.preventDefault()
    openSuccessMessage();

    const
      fields = item.querySelectorAll('input')

    fields.forEach(item => disable(item))

    const
      textareas = item.querySelectorAll('textarea')

    textareas.forEach(item => disable(item))

    const
      buttons = item.querySelectorAll('button[type="submit"]')

    buttons.forEach(item => disable(item))
  }))

  // Parallax
  var scenes = document.querySelectorAll('.parallax');
  scenes.forEach(item => {
    var parallaxInstance = new Parallax(item);
  })


  // Inputmask
  const im = new Inputmask('8(999)-999-99-99');
  const telFields = document.querySelectorAll('input[type="tel"]')
  telFields.forEach(item => im.mask(item))


  // Scroll
  function scrollTrigger(selector) {
    let els = document.querySelectorAll(selector)

    els = Array.from(els)

    els.forEach(el => {
      addObserver(el)
    })
  }

  scrollTrigger('.scroll-reveal')
})();
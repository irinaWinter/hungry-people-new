(function () {
  // Preload
  var body = document.querySelector('body');
  body.classList.remove('preload');

  const swiper = new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
    },
  });


  // Map
  let yandexMap = document.querySelector('#map');

  if (yandexMap) {
    let executed = false;

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
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

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
    let mapInitialised = false;

    if (!document.querySelector('script[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]')) {
      let scriptYMap = document.createElement('script');
      let body = document.querySelector('body');

      scriptYMap.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
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
    var center = [55.704874, 37.585359];

    var myMap = new ymaps.Map("map", {
      center: center,
      zoom: 17
    }, {
      searchControlProvider: "yandex#search"
    }),

      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        "<div style='color: #FFFFFF; font-weight: bold;'>$[properties.iconContent]</div>"
      ),

      myPlacemark = new ymaps.Placemark([55.704874, 37.585359], {
        hintContent: "ул. Вавилова, д. 7 Москва, 117312, Россия",
      }, {
        iconLayout: "default#image",
        iconImageHref: "../../img/logo.svg",
        iconImageSize: [18, 24],
        iconImageOffset: [-9, -24]
      })

    // myMap.geoObjects.add(myPlacemark);
    myMap.controls.remove('searchControl');
  }

  // const lightGallery = document.getElementById('lightgallery');
})();
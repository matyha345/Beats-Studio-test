"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadContent("header", "/components/_header.html");
    loadContent("information", "/components/_information.html")

    const createPreviewInformation = () => {
        const results = document.querySelector(".preview__information-icons")

        const createInformation = previewDataIcons.map((item) => `
            <div class="preview__information-icon">
                <div class="preview__information-body">
                    <img src="${item.imgIcon}" alt="${item.imgAlt}" />
                    <p class="preview__information-icon-text">${item.text}</p>
                </div>
            </div>
        `)

        results.innerHTML = createInformation.join("")
    }

    createPreviewInformation() // вызываем функцию


    // Функция preloadImages выполняет предварительную загрузку изображений по указанным адресам.
    // Принимает массив URL-адресов изображений в качестве аргумента.
    // Возвращает промис, который разрешается, когда все изображения успешно загружены, или отклоняется в случае ошибки.
    const preloadImages = (address) => {
        return Promise.all(address.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image(); // Создаем новый элемент изображения.
                img.src = url; // Устанавливаем источник изображения для предварительной загрузки.
                img.onload = resolve; // Обработчик события, вызываемый при успешной загрузке изображения.
                img.onerror = reject; // Обработчик события, вызываемый в случае ошибки загрузки изображения.
            });
        }));
    };

    preloadImages([
        ...dataImageSwiper.silver,
        ...dataImageSwiper.black,
        ...dataImageSwiper.pink,
        ...dataImageSwiper.white
    ]).then(() => {
        const swiper = new Swiper("#mainSwiper", {
            effect: "fade",
            // loop: true,
            navigation: {
                nextEl: ".swiper__controller-next",
                prevEl: ".swiper__controller-prev",
            },
        })

        swiper.on('init', function () {
            createSwiperBeatsBottom();
            swiper.update();
        });

        swiper.on('slideChange', function () {
            activateIndexSwiperItem(swiper.activeIndex);
        });

        const colorButtons = document.querySelectorAll('.swiper__color-handler-inner');

        colorButtons.forEach((button, index) => {
            button.addEventListener('click', function () {
                colorButtons.forEach(btn => {
                    btn.classList.remove('active-swiper');
                });

                this.classList.add('active-swiper');

                const activeIndex = this.getAttribute('data-index');

                const color = this.getAttribute('data-color');
                createSwiperBeats(color, activeIndex);
                createSwiperBeatsBottom(color, activeIndex);
                swiper.update();

            });
        });

        const createSwiperBeats = (color, activeIndex) => {
            if (!color) {
                color = 'silver';
            }
            if (!activeIndex) {
                activeIndex = 0
            }
            const results = document.getElementById("mainSwiperResults");

            const cardResults = dataImageSwiper[color].map((item, index) => `
            <div class="swiper-slide">
                <div class="swiper__wrapper-inner">
                    <div class="swiper__wrapper-card">
                        <img src=${item} alt='images card' />
                    </div>
                </div>
            </div>
        `)

            results.innerHTML = cardResults.join("")
            swiper.slideTo(activeIndex);
            activateIndexSwiperItem(activeIndex)

        }

        const createSwiperBeatsBottom = (color, activeIndex) => {
            if (!color) {
                color = 'silver';
            }
            if (!activeIndex) {
                activeIndex = 0
            }
            const results = document.querySelector(".swiper__beats-bottom")

            const cardResults = dataImageSwiper[color].map((item, index) => `
            <div class="swiper__bottom-image" data-index="${index}" id="activeSelector">
                <img class="swiper__bottom-image--img" src=${item} alt="Beats Studio images">
            </div>
        `)

            results.innerHTML = cardResults.join("")
            swiper.slideTo(activeIndex);
            activateIndexSwiperItem(activeIndex)


            // Добавляем обработчики событий для каждой радио-кнопки внутри swiper__beats-bottom
            const radioButtons = document.querySelectorAll('.swiper__bottom-image');
            radioButtons.forEach(radio => {
                radio.addEventListener('click', function () {
                    const index = parseInt(this.getAttribute('data-index'));
                    swiper.slideTo(index); // Переходим к слайду с индексом, соответствующим выбранному элементу
                });
            });
        }

        const activateIndexSwiperItem = (index) => {
            const activeSelectorItems = document.querySelectorAll('.swiper__bottom-image');

            activeSelectorItems.forEach((item, idx) => {
                const imgActive = item.querySelector('.swiper__bottom-image--img');
                if (idx === index) {
                    imgActive.classList.add("active");
                } else {
                    imgActive.classList.remove("active");
                }
            });
        };

        createSwiperBeats()
        createSwiperBeatsBottom()
    });


    const timeLeft = {
        hours: 3,
        minutes: 59,
        seconds: 37,
        tenths: 7
    };

    // Форматирование чисел
    const formatNumber = num => {
        return num < 10 ? `0${num}` : num;
    };

    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const tenthsElement = document.getElementById("tenths");

    const timer = setInterval(() => {
        timeLeft.tenths -= 1;

        if (timeLeft.tenths < 0) {
            timeLeft.seconds -= 1;
            timeLeft.tenths = 9;

            if (timeLeft.seconds < 0) {
                timeLeft.minutes -= 1;
                timeLeft.seconds = 59;

                if (timeLeft.minutes < 0) {
                    timeLeft.hours -= 1;
                    timeLeft.minutes = 59;
                }
            }
        }

        if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds < 0) {
            clearInterval(timer);
        }

        hoursElement.textContent = formatNumber(Math.floor(timeLeft.hours));
        minutesElement.textContent = formatNumber(Math.floor(timeLeft.minutes));
        secondsElement.textContent = formatNumber(Math.floor(timeLeft.seconds)) + '.';
        tenthsElement.textContent = timeLeft.tenths;
    }, 100);



    const accordionMain = document.getElementById("accordion-main");

    const accordionSections = dataSectionsAccordion.map((section, index) => {

        const accordionSection = document.createElement('div');
        accordionSection.classList.add("accordion__body");

        accordionSection.innerHTML = `
            <div class="accordion__body-inner">
                <div class="accordion__body-heading">
                    <div class="accordion__body-icon">
                        <img src="${section.icon}" />
                    </div>
                    <div class="accordion__body-title">${section.title}</div>
                </div>
                <div class="accordion__body-hidden ${index < 2 ? 'active__icon' : 'closes__icon'}">
                </div>
            </div>
            <p class="accordion__text ${index === 0 || index === 1 ? 'active__accordion' : ''}" >${section.text}</p>
        `;
        return accordionSection;
    });

    accordionSections.forEach((accordionSection, index) => {
        accordionMain.appendChild(accordionSection);
    });


    accordionMain.addEventListener('click', (event) => {
        const target = event.target.closest('.accordion__body');
        if (!target) return;

        const content = target.querySelector('.accordion__text');
        const hiddenToggle = target.querySelector('.accordion__body-hidden');

        // Переключаем класс 'active__accordion'
        content.classList.toggle('active__accordion');

        hiddenToggle.classList.toggle('closes__icon');
        hiddenToggle.classList.toggle('active__icon');
    });



    const swiperReviews = new Swiper("#mainReviews", {
        spaceBetween: 3,
        slidesPerView: 1.3,
        centeredSlides: true,
        pagination: false,
        initialSlide: 1,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        }
    })



    const createSwiperReviews = () => {
        const results = document.getElementById("mainSwiperReviews")

        const cardResults = dataInformationReviews.map((item) => `
            <div class="swiper-slide">
                <div class="swiper__reviews-body">
                    <div class="swiper__reviews-content">
                        <div class="swiper__reviews-inner">
                            <p class="swiper__reviews-text">${item.title}</p>
                            <div class="swiper__reviews-name">
                                <img src='./public/images/svg/youtube.svg' alt='YouTube Icon' />
                                <h1 class="swiper__reviews-name--title">${item.name}</h1>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>   
        `)

        results.innerHTML = cardResults.join("")

    }

    createSwiperReviews()

})


// Этот скрипт выполняет асинхронную загрузку содержимого файла.
// elementId (идентификатор элемента, в который будет вставлен контент) 
// и contentFile (путь к файлу с контентом).
async function loadContent(elementId, contentFile) {
    try {
        const response = await fetch(contentFile); // Выполняем GET запрос
        if (!response.ok) { // Проверяем, успешно ли выполнился запрос
            throw new Error('Network response was not ok');
        }
        const data = await response.text(); // Получаем текст ответа
        document.getElementById(elementId).innerHTML = data; // Вставляем текст в указанный элемент
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}
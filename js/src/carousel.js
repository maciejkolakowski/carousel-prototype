'use strict';

function carousel(selector, options) {
    var options = options;
    if (options === undefined) {
        options = {
            slideDuration: 2000,
            speed: 400
        }
    }

    this.defaults = {
        slideDuration: options.slideDuration,
        speed: options.speed
    };
    this.animated = false;

    this.element = document.querySelector(selector);
    this.slidesWrapper = this.element.querySelector('.slides-wrapper');
    this.slides = this.slidesWrapper.querySelectorAll('.slide');
    this.init();
}

carousel.prototype.changeSlide = function(changeType) {

    if (this.animated) {
        return;
    }
    this.animated = true;
    this.clearTimer();

    var activeSlide = this.slidesWrapper.querySelector('.' + this.activeClassName);
    var transformedSpeed = this.defaults.speed / 1000;

    if (!this.cssTransitions) {
        TweenLite.to(activeSlide, transformedSpeed, {
            opacity: 0
        });
    }

    activeSlide.classList.remove(this.activeClassName);

    switch (changeType) {

        case 'next':
            if (activeSlide.nextElementSibling) {
                activeSlide.nextElementSibling.classList.add(this.activeClassName);
                if (!this.cssTransitions) {
                    TweenLite.to(activeSlide.nextElementSibling, transformedSpeed, {
                        opacity: 1
                    });
                }
            } else {
                this.slides[0].classList.add(this.activeClassName);
                if (!this.cssTransitions) {
                    TweenLite.to(this.slides[0], transformedSpeed, {
                        opacity: 1
                    });
                }
            }
            break;

        case 'prev':
            if (activeSlide.previousElementSibling) {
                activeSlide.previousElementSibling.classList.add(this.activeClassName);
                if (!this.cssTransitions) {
                    TweenLite.to(activeSlide.previousElementSibling, transformedSpeed, {
                        opacity: 1
                    });
                }
            } else {
                this.slides[this.slides.length - 1].classList.add(this.activeClassName);
                if (!this.cssTransitions) {
                    TweenLite.to(this.slides[this.slides.length], transformedSpeed, {
                        opacity: 1
                    });
                }
            }
            break;

    }

    this.initTimer();

};

carousel.prototype.bindEvents = function(arrowLeft, arrowRight) {
    var self = this;
    arrowLeft.addEventListener('click', function(e) {
        e.preventDefault();
        self.changeSlide('prev');
    });
    arrowRight.addEventListener('click', function(e) {
        e.preventDefault();
        self.changeSlide('next');
    });
}

carousel.prototype.cssTransitionSupported = function() {
    var elem = document.createElement('modernizr');
    var props = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
    for (var i in props) {
        var prop = props[i];
        var result = elem.style[prop] !== undefined ? prop : false;
        if (result) {
            this.cssTransitions = result;
            break;
        }
    }
};

carousel.prototype.clearTimer = function() {
    if (this.carouselTimer) {
        clearInterval(this.carouselTimer);
    }
}

carousel.prototype.initTimer = function() {
    var self = this;
    this.animated = false;
    this.carouselTimer = setInterval(function() {
        self.changeSlide('next');
    }, this.defaults.slideDuration);
};

carousel.prototype.init = function() {

    this.cssTransitionSupported();

    this.activeClassName = this.cssTransitions ? 'active' : 'activate';

    this.slides[0].classList.add(this.activeClassName);

    if (this.cssTransitions) {
        var transitionName;
        switch (this.cssTransitions) {
            case 'transition':
                transitionName = 'transition';
                break;
            case 'WebkitTransition':
                transitionName = '-webkit-transition';
                break;
            case 'MozTransition':
                transitionName = '-moz-transition';
                break;
            case 'OTransition':
                transitionName = '-o-transition';
                break;
            case 'msTransition':
                transitionName = '-ms-transition';
                break;
        }
        for (var i = 0; i < this.slides.length; i++) {
            this.slides[i].setAttribute('style', transitionName + ': ' + this.defaults.speed + 'ms opacity ease-in-out');
        }
    } else {
        document.body.classList.add('no-csstransitions');
    }

    var navContainer = document.createElement('div');
    var arrowLeft = document.createElement('a');
    var arrowRight = document.createElement('a');
    navContainer.classList.add('nav-container');

    arrowLeft.classList.add('arrow', 'arrow-left');
    arrowRight.classList.add('arrow', 'arrow-right');

    arrowLeft.setAttribute('href', '#');
    arrowRight.setAttribute('href', '#');

    arrowLeft.innerHTML = '<span class="anchor-text">PREV</span>' +
        '<span class="anchor-background"></span>' +
        '<img src="images/arrow-left.png" alt="Previous slide">';

    arrowRight.innerHTML = '<span class="anchor-text">NEXT</span>' +
        '<span class="anchor-background"></span>' +
        '<img src="images/arrow-right.png" alt="Next slide">';

    navContainer.appendChild(arrowLeft);
    navContainer.appendChild(arrowRight);

    this.element.appendChild(navContainer);
    this.bindEvents(arrowLeft, arrowRight);
    this.initTimer();
};

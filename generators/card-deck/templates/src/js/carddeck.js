import * as Hammer from 'hammerjs';
import * as analytics from './analytics';

// TODO: Put these into CardDeck class
const NAVIGATION_LOAD = 'nav-pageload';
const NAVIGATION_SWIPE = 'nav-swipe';
const NAVIGATION_PAN = 'nav-pan';
const NAVIGATION_ARROW_BUTTON = 'nav-arrowbutton';
const NAVIGATION_KEYBOARD = 'nav-keyboard';
const NAVIGATION_CLICK_CARD = 'nav-clickcard';

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach
}

export default class CardDeck {
  constructor(selector) {
    // Set up DOM Elements
    this.arrowPrevious = document.querySelector(selector + ' .arrow__prev');
    this.arrowNext = document.querySelector(selector + ' .arrow__next');
    this.container = document.querySelector(selector + ' .card-deck__container');
    this.carousel = document.querySelector(selector + ' .card-deck__carousel');
    this.cards = document.querySelectorAll(selector + ' .card-deck__item');
    this.paginationTotal = document.querySelector(selector + ' .pagination__total');
    this.paginationCurrent = document.querySelector(selector + ' .pagination__current');

    // Initialize Pagination
    this.itemCount = this.cards.length;
    this.paginationTotal.textContent = this.itemCount;

    // Define Card Sizes
    this.itemMargin = 20;
    this.cardWidth = 350;
    this.maxItemWidth = this.cardWidth + (2 * this.itemMargin);
    this.itemWidth = null;
    this.setCardDeckDimensions();

    // Set up Hammer
    this.hammer = new Hammer.Manager(this.carousel, {domEvents: true});
    this.hammer.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL }));
    this.hammer.get('pan').recognizeWith('swipe');
    this.hammer.on("panend panleft panright swipeleft swiperight", (evt) => { this.handleHammer(evt); });

    // Track Touch Events To Handle Edge Cases
    this.lastEvents = [];
    this.hammering = false;

    // Set Up Variables for Analytics Trackers
    analytics.setupVisualsGoogleAnalytics();
    this.lastCardIndex = 0;
    this.slideStartTime =  new Date();
    this.timeOnLastSlide = null;
    this.trackSeenCards = []
    this.trackNavigationDiscovery = {}
    this.setUpNavigationDiscoveryTrackers();

    // Set Up Events
    window.addEventListener("resize", () => { this.handleResize(); });
    document.addEventListener("keydown", (evt) => { this.handleKeyboardClick(evt); });
    this.arrowNext.addEventListener('click', () => { this.handleArrowNextClick(); });
    this.arrowPrevious.addEventListener('click', () => { this.handleArrowPrevClick(); });
    this.carousel.addEventListener('transitionend', () => { this.handleTransitionEnd(); });
    this.cards.forEach((card, i) => {
      card.addEventListener('click', () => { this.handleCardClick(i); });
      card.addEventListener('mousedown', () => { this.handleCardMousedown(); });
      card.addEventListener('mouseup', () => { this.handleCardMouseup(); });
    });

    // Set first card as active card
    this.showCard(0, NAVIGATION_LOAD, false);
  }

  // Define Event Handlers
  handleResize() {
    this.setCardDeckDimensions();
    this.showCard(this.currentItemIndex, false, false); // don't animate on resize
  }

  handleArrowNextClick() {
    this.showNextCard(NAVIGATION_ARROW_BUTTON, true);
  }

  handleArrowPrevClick() {
    this.showPreviousCard(NAVIGATION_ARROW_BUTTON, true);
  }

  handleTransitionEnd() {
    this.carousel.classList.remove("card-deck__carousel--animate");
  }

  handleKeyboardClick(evt) {
    switch (evt.keyCode) {
      case 37:
        this.showPreviousCard(NAVIGATION_KEYBOARD, true); break;
      case 39:
        this.showNextCard(NAVIGATION_KEYBOARD, true); break;
    }
  }

  // Cursor needs to change on click, pan and swipe, not just click
  handleCardMousedown() {
    this.carousel.classList.add('card-deck__carousel--dragging');
  }

  handleCardMouseup() {
    this.carousel.classList.remove('card-deck__carousel--dragging');
  }

  handleCardClick(clickedCardIndex) {
    // Weird edge case: Only do this if user not panning/swiping
    if (this.currentItemIndex != clickedCardIndex && !this.hammering) {
      this.showCard(clickedCardIndex, NAVIGATION_CLICK_CARD, true);
    };

    // TODO: This code is kinda gross lets make it better
    // Peek next card (or previous card, if at end of deck) on click active card
    if (this.currentItemIndex == clickedCardIndex && !this.hammering) {
      if (clickedCardIndex != this.itemCount - 1) {
        var nextItem = this.cards[clickedCardIndex + 1];
        nextItem.addEventListener('animationend', function() {
          nextItem.classList.remove('card-deck__item--peek');
        })
        nextItem.classList.add('card-deck__item--peek');
      } else {
        var previousItem = this.cards[clickedCardIndex - 1];
        previousItem.addEventListener('animationend', function() {
          previousItem.classList.remove('card-deck__item--peek-reverse');
        })
        previousItem.classList.add('card-deck__item--peek-reverse');
      }
    }
  }

  // Handle Hammer
  handleHammer(evt) {
    switch (evt.type) {
      case 'panright':
      case 'panleft':
        this.updateActiveHammerState(evt);
        this.handleHammerPan(evt);
        break;

      case 'swipeleft':
        this.updateActiveHammerState(evt);
        this.showNextCard(NAVIGATION_SWIPE, true);
        break;

      case 'swiperight':
        this.updateActiveHammerState(evt);
        this.showPreviousCard(NAVIGATION_SWIPE, true);
        break;

      case 'panend':
        this.handleHammerPanEnd(evt);
        setTimeout(() => { this.resetHammerState(); }, 50); // wait for click to end, reset click/pan state
        break;
    }
  }

  // These functions handle weird edge case where clicks/pans can get in the way of each other
  updateActiveHammerState(evt) {
    this.hammering = true;
    this.lastEvents.push(evt.type);
  }

  resetHammerState() {
    this.hammering = false;
    this.lastEvents = [];
  }

  handleHammerPan(evt) {
    // Handle edge case where Hammer registers a pan after a swipeleft/swiperight
    if (this.lastEvents.indexOf('swipeleft') < 0 && this.lastEvents.indexOf('swiperight') < 0) {
      // stick to the finger
      var itemOffset = -(100/this.itemCount) * this.currentItemIndex;
      var dragOffset = ((100/this.itemWidth) * evt.deltaX) / this.itemCount;

      // slow down at the first and last pane
      if ((this.currentItemIndex == 0 && evt.direction == Hammer.DIRECTION_RIGHT) ||
          (this.currentItemIndex == this.itemCount - 1 && evt.direction == Hammer.DIRECTION_LEFT)) {
          dragOffset *= .4;
      }
      this.setContainerOffset(dragOffset + itemOffset, false, false);
    }
  }

  handleHammerPanEnd(evt) {
    // Handle edge case where Hammer registers a pan after a swipeleft/swiperight
    if (this.lastEvents.indexOf('swipeleft') < 0 && this.lastEvents.indexOf('swiperight') < 0) {
      // more then 50% moved, navigate
      if (Math.abs(evt.deltaX) > this.itemWidth/2) {
        if (evt.direction == Hammer.DIRECTION_RIGHT) {
          this.showCard(++this.currentItemIndex, NAVIGATION_PAN, true);
        } else {
          this.showCard(--this.currentItemIndex, NAVIGATION_PAN, true);
        }
      } else {
        this.showCard(this.currentItemIndex, NAVIGATION_PAN, true);
      }
    }
  }

  // Set Dimensions onload and onresize
  setCardDeckDimensions() {
    this.setCardWidths();
    this.setCardHeightsAndAlignRows();
  }

  setCardWidths() {
    let self = this;
    this.containerWidth = this.container.getBoundingClientRect().width;

    // Handle viewports smaller than max card width
    var isItemAtMaxWidth = this.containerWidth > this.maxItemWidth;
    this.itemWidth = isItemAtMaxWidth ? this.maxItemWidth : (this.containerWidth - this.itemMargin * 2);
    if (isItemAtMaxWidth) {
      this.carousel.style.width = (this.itemWidth * this.itemCount) + "px";
    } else {
      this.carousel.style.width = ((this.itemWidth + this.itemMargin * 2) * this.itemCount) + "px";
    }
    this.cards.forEach((card) => {
      card.style.width = self.itemWidth + "px";
    })
  }

  setCardHeightsAndAlignRows() {
    // TODO: this needs to handle the card headers as well:
    // maybe those should be refactored into just another row type
    var headers = []
    var headerHeights = []

    var rowsByCard = []
    var heightsByRow = [];
    var maxHeightsForEachRow = []

    // TODO: un-nest nested for loop
    this.cards.forEach((card, i) => {
      // handle headers
      headers[i] = card.querySelector('.card__header');
      headerHeights[i] = headers[i].getBoundingClientRect().height;

      // save query so we can use it later
      rowsByCard[i] = card.querySelectorAll('.card-module-row');

      // For card i, save height of row j in heightsByRow[j][i]
      rowsByCard[i].forEach((row, j) => {
        if (heightsByRow[j] == 'undefined' || !(heightsByRow[j] instanceof Array)) {
          heightsByRow[j] = [row.clientHeight]
        } else {
          heightsByRow[j].push(row.clientHeight)
        }
      });
    });

    // Get max height for each row across all cards
    heightsByRow.forEach((arr, i) => {
      console.log("heightsByRow", arr);
      maxHeightsForEachRow[i] = Math.max.apply(null, arr);
    });

    // for each row j in card i, set height of j to maxHeightsForEachRow[j]
    rowsByCard.forEach((card, i) => {
      card.forEach((row, i) => {
        console.log("maxHeightsForEachRow", maxHeightsForEachRow)
        row.style.height = maxHeightsForEachRow[i] + "px";
      });
    });

    // set headers to same height
    var maxHeaderHeight = Math.max.apply(null, headerHeights);
    headers.forEach((header) => { header.style.height = maxHeaderHeight + "px"; });
  }

  // Update Card State. This function orchestrates navigating between cards.
  showCard(index, navigationMethod, animate) {
    this.currentItemIndex = Math.max(0, Math.min(index, this.itemCount - 1));
    var offset = - ((100/this.itemCount) * this.currentItemIndex);

    // This is where the magic happens
    this.setContainerOffset(offset, animate);
    this.updatePagination();
    this.trackCardDeckUse(this.currentItemIndex, navigationMethod);

    // Update Next, Previous, Action classes
    this.cards.forEach((card) => card.classList.remove('card-deck__item--next', 'card-deck__item--prev', 'card-deck__item--active'));
    this.cards[this.currentItemIndex].classList.add('card-deck__item--active');
    if (this.currentItemIndex != this.itemCount - 1) {
      this.cards[this.currentItemIndex + 1].classList.add('card-deck__item--next');
    }
    if (this.currentItemIndex != 0) {
      this.cards[this.currentItemIndex - 1].classList.add('card-deck__item--prev');
    }
  }

  // Helper functions for next/previous cards
  showNextCard(navigationMethod, animate) {
    this.showCard(++this.currentItemIndex, navigationMethod, animate);
  }
  showPreviousCard(navigationMethod, animate) {
    this.showCard(--this.currentItemIndex, navigationMethod, animate);
  }

  setContainerOffset(percent, animate) {
    if (animate) { this.carousel.classList.add("card-deck__carousel--animate"); }
    var centerAmount = (this.containerWidth > this.maxItemWidth) ? (this.containerWidth/2 - this.itemWidth/2) : 0;
    var transformStr = "translateX("+ percent +"%) translateX(" + centerAmount +"px)";
    this.carousel.style.transform = transformStr;
  }

  updatePagination() {
    this.paginationCurrent.textContent = this.currentItemIndex + 1;
    if (this.currentItemIndex == 0) {
      this.arrowPrevious.classList.add('arrow--disabled');
    } else {
      this.arrowPrevious.classList.remove('arrow--disabled');
    }

    if (this.currentItemIndex == this.itemCount - 1) {
      this.arrowNext.classList.add('arrow--disabled');
    } else {
      this.arrowNext.classList.remove('arrow--disabled');
    }
  }

  // Set Up Card Analytics
  setUpNavigationDiscoveryTrackers() {
    this.trackNavigationDiscovery[NAVIGATION_SWIPE] = false;
    this.trackNavigationDiscovery[NAVIGATION_PAN] = false;
    this.trackNavigationDiscovery[NAVIGATION_ARROW_BUTTON] = false;
    this.trackNavigationDiscovery[NAVIGATION_KEYBOARD] = false;
    this.trackNavigationDiscovery[NAVIGATION_CLICK_CARD] = false;
  }

  // This is the main analytics function. It orchestrates analytics tracking.
  trackCardDeckUse(cardIndex, navigationMethod) {
    if (navigationMethod != NAVIGATION_LOAD && cardIndex != this.lastCardIndex) {
      this.trackTimeOnCard(cardIndex);
      analytics.trackEvent('used-navigation', navigationMethod)
      this.trackProgress(cardIndex);
      this.trackDiscoveryOfNavigationMethods(navigationMethod);
    }
  }

  trackProgress(cardIndex) {
    if (this.trackSeenCards.indexOf(cardIndex) < 0) {
      analytics.trackEvent('card-view', cardIndex + 1);
      this.trackSeenCards.push(cardIndex);
    }
  }

  trackTimeOnCard(cardIndex) {
    var currentTime = new Date();
    var timeOnLastSlide = Math.abs(currentTime - this.slideStartTime);
    this.lastCardIndex = cardIndex;
    analytics.trackEvent('time-on-card', this.lastCardIndex + 1, timeOnLastSlide);
    this.slideStartTime = new Date();
  }

  // One-Time Custom Events For Navigation Methods
  trackDiscoveryOfNavigationMethods(navigationMethod) {
    if (navigationMethod !== undefined) {
      if (!this.trackNavigationDiscovery[navigationMethod]) {
        analytics.trackEvent('discovered-navigation', `discovered-${navigationMethod}`);
        this.trackNavigationDiscovery[navigationMethod] = true;
      }
    }
  }
}

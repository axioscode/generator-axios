import pym from 'pym.js';
import CardDeck from './carddeck';

var pymChild = null;

document.addEventListener("DOMContentLoaded", function() {
  pymChild = new pym.Child();
  window.onload = function() {
  	var cardDeck = new CardDeck('#<%= meta.slug %>');
  	pymChild.sendHeight();
  }
});

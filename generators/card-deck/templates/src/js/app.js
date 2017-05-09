import pym from 'pym.js';
import CardDeck from './carddeck';

var pymChild = null;

window.onload = function() {
  pymChild = new pym.Child();
  var scotusCardDeck = new CardDeck('#<%= meta.slug %>');
  pymChild.sendHeight();
}

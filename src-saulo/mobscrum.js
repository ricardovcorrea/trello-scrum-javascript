import cardBadges from './features/card-badges';
import listActionButtons from './features/list-actions';
import boardButtons from './features/board-buttons';

//GLOBALS
window._boardCards = [];
window._boardLists = [];

//Inicializa o client de power up do trello
Trello.authorize({
    type: 'popup',
    name: 'Mobscrum',
    scope: {
        read: 'true',
        write: 'true' },
    expiration: 'never',
    success: function() {
        TrelloPowerUp.initialize({
            'card-badges': cardBadges.getCardBadges,
            'list-actions': listActionButtons.getListActionButtons,
            'board-buttons': boardButtons.getBoardButtons
        });
    }
});
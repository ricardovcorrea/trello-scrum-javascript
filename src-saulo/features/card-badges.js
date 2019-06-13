import utils from '../utils';

//Alert badges
const getCardAlertBadges = async (_trello) => {

    //Pega todas as informações do card atual
    let card = await _trello.card('all');
    
    //Pega o tipo do card atual
    let cardType = utils.getCardType(card);
    
    //Badge se não for possivel identificar o tipo do card
    if(!cardType) {
        return {
            text: `SEM TIPO`,
            color: 'red',
            icon: ICONS.Question,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        }
    }

    //De acordo com o tipo do card, chama a função que retorna suas badges
    switch(cardType){
        case CARD_TYPES.History: {
            return getHistoryCardAlertBadges(card); 
        }
        case CARD_TYPES.Task: {
            return getTaskCardAlertBadges(card); 
        }
    }
}

const getTaskCardAlertBadges = async (card)=> {

    //Inicializa o array de badges de alerta do card de tarefa atual
    let taskAlertBadges = [];

    //Tipo de lista do card
    let cardListType = utils.getListType(card.idList);
    
    //Estatisticas do card
    let cardStats = utils.getCardEstimatedSpent(card);

    //Tarefa sem membro
    if(!card.members || card.members.length == 0) {
        taskAlertBadges.push({
            text: `SEM MEMBRO`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    //Tarefa em QA, MERGE ou DONE sem horas utilizadas
    if((cardListType == LIST_TYPES.QA || cardListType == LIST_TYPES.Merge || cardListType == LIST_TYPES.Done) && !cardStats.spent) {
        taskAlertBadges.push({
            text: `SEM HORAS`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    //Tarefa sem referencia
    if(!card.attachments || card.attachments.length == 0) {
        taskAlertBadges.push({
            text: `SEM REFERENCIA`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }
    
    return taskAlertBadges;
}

const getHistoryCardAlertBadges = async (card)=> {
    
    //Inicializa o array de badges de alerta do card de historia
    let historyAlertBadges = [];

    //Tipo de lista do card
    let cardListType = utils.getListType(card.idList);
    
    //Estatisticas do card
    let cardStats = utils.getCardEstimatedSpent(card);

    let isBugCard = utils.isBugCard(card);

    //Historia em QA, MERGE ou DONE sem membros
    if((cardListType == LIST_TYPES.QA || cardListType == LIST_TYPES.Merge || cardListType == LIST_TYPES.Done) && (!card.members || card.members.length == 0)) {
        historyAlertBadges.push({
            text: `SEM MEMBROS`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    //Historia em QA, MERGE ou DONE sem pontos utilizados
    if((cardListType == LIST_TYPES.QA || cardListType == LIST_TYPES.Merge || cardListType == LIST_TYPES.Done) && !cardStats.spent) {
        historyAlertBadges.push({
            text: `SEM PONTOS`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    //Historia que não é bug, sem estimativa
    if(!isBugCard && !cardStats.estimated) {
        historyAlertBadges.push({
            text: `SEM ESTIMATIVA`,
            color: 'red',
            icon: ICONS.Alert,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    return historyAlertBadges;
}
////////////////////////////////////////////////////////////////////////////////////////////////////


//Estimate badges
const getCardEstimatesBadges = async (_trello) => {

    //Pega todas as informações do card atual
    let card = await _trello.card('all');
    
    //Pega o tipo do card atual
    let cardType = utils.getCardType(card);

    //De acordo com o tipo do card, chama a função que retorna suas badges
    switch(cardType){
        case CARD_TYPES.History: 
        case CARD_TYPES.Task: {
            return getCardEstimateBadges(card); 
        }
    }
}

const getCardEstimateBadges = async (card) => {

    //Inicializa o array de badges de alerta do card de tarefa atual
    let cardEstimageBadges = [];

    //Estatisticas do card
    let cardStats = utils.getCardEstimatedSpent(card);

    //Badge de tempo/pontos estimados
    if(cardStats.estimated) {
        cardEstimageBadges.push({
            text: `EST -> ${cardStats.estimated}` ,
            color: 'green',
            icon: ICONS.Time,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    //Badge de tempo/pontos gastos
    if(cardStats.spent) {
        cardEstimageBadges.push({
            text: `GST -> ${cardStats.spent}`,
            color: 'blue',
            icon: ICONS.Time,
            refresh: CONFIGURATIONS.cardBadges.refreshTime
        });
    }

    return cardEstimageBadges;
}
////////////////////////////////////////////////////////////////////////////////////////////////////


const cardBadges = { 
    getCardBadges: async (trello, options) => {
        
        //Inicializa o array de badges do card atual
        let cardBadges = [];
        
        //Salva todos os cards do board de forma global
        _boardCards = await trello.cards('all');
        
        //Salva todos as listas do board de forma global
        _boardLists = await trello.lists('all');
        
        //Retorna as badges de alerta
        let alertBadges = await getCardAlertBadges(trello) || [];
        cardBadges = cardBadges.concat(alertBadges);
    
        //Retorna as badges de estimativa
        let estimatesBadges = await getCardEstimatesBadges(trello) || [];
        cardBadges = cardBadges.concat(estimatesBadges);
        
        return cardBadges;
    }
}

export default cardBadges;
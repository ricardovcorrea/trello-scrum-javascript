window.CONFIGURATIONS = {
    cardBadges : {
        refreshTime: 10
    }
}

window.ICONS = {
    Alert: 'https://mobscrum.mobfiq.com.br/dev/images/alert.png',
    Time: 'https://mobscrum.mobfiq.com.br/dev/images/clock.png',
    Question: 'https://mobscrum.mobfiq.com.br/dev/images/question.png'
}

window.CARD_TYPES = {
    Client: 'client',
    Epic: 'epic',
    History: 'history',
    Task: 'task'
}

window.LIST_TYPES = {
    Todo: 'todo',
    Doing: 'doing',
    Stopped: 'stopped',
    QA: 'qa',
    Merge: 'merge',
    Done: 'done'
}

const _isBugCard = (card) => {  
    //Busca pela etiqueta BUG no card, se retornar alguma coisa diferente de null, o card é de bug  
    return card.labels.find(c => c.name.toLowerCase() === "bug");
};

const _getCardTeam = (card) => {

    if (card.labels.find(c => c.name.toLowerCase() === "ios"))
        return "IOS";

    if (card.labels.find(c => c.name.toLowerCase() === "android"))
        return "Android";

    if (card.labels.find(c => c.name.toLowerCase() === "backend"))
        return "Backend";

    return null;
};


const _getCardType = (card) => {   
    if(card.labels && card.labels.length > 0) {
        //Client card
        if(card.labels.find(c => c.name.toLowerCase() === "cliente")) {
            return CARD_TYPES.Client;
        }

        //Epic card
        if(card.labels.find(c => c.name.toLowerCase() === "épico")) {
            return CARD_TYPES.Epic;
        }

        //History card
        if(card.labels.find(c => c.name.toLowerCase() === "historia")) {
            return CARD_TYPES.History;
        }

        //Task card
        if(card.labels.find(c => c.name.toLowerCase() === "tarefa")) {
            return CARD_TYPES.Task;
        }
    }
};

const _getCardEstimatedSpent = (card) => {
    let statistics = {
        estimated: null,
        spent: null
    };

    let taskEstimatedFieldOnName = card.name.match(/\((\d+(\.\d+)?)\)/);
    if(taskEstimatedFieldOnName) {
        let estimatedFieldValue = taskEstimatedFieldOnName[0].replace("(","").replace(")","");
        statistics.estimated = isNaN(estimatedFieldValue) ? 0 : parseFloat(estimatedFieldValue);
    }

    let taskSpentFieldOnName = card.name.match(/[-+]?[[0-9]]*\.?[[0-9]]+/);
    if(taskSpentFieldOnName) {
        let spentFieldValue = taskSpentFieldOnName[0].replace("[","").replace("]","");
        statistics.spent = isNaN(spentFieldValue) ? 0 : parseFloat(spentFieldValue);
    }
    
    return statistics;
};

const _getListInfo = (listId) => {
    return _boardLists.find(l => l.id == listId);
};

const _getListType = (idList) => {   
    //Busca as informações da lista
    let listInfo = _getListInfo(idList);
    
    //Se não conseguir pegar as informações da lista retorna null
    if(!listInfo || !listInfo.name) return;

    //Retorna um tipo de lista de acordo com o nome da lista
    switch(listInfo.name.toLowerCase()) {
        case 'tarefas' : {
            return LIST_TYPES.Todo;
        }
        case 'desenvolvendo' : {
            return LIST_TYPES.Doing;
        } 
        case 'impedido' : {
            return LIST_TYPES.Stopped;
        } 
        case 'qa' : {
            return LIST_TYPES.QA;
        } 
        case 'merge' : {
            return LIST_TYPES.Merge;
        } 
        case 'concluído' : {
            return LIST_TYPES.Done;
        } 
    }
};

const utils = { 
    isBugCard: _isBugCard,
    getCardTeam: _getCardTeam,
    getCardType: _getCardType ,
    getCardEstimatedSpent: _getCardEstimatedSpent,
    getListInfo: _getListInfo,
    getListType: _getListType
}

export default utils;
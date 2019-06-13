import utils from '../utils';

//Statistics buttons
const getListStatisticsActionButtons = async (_trello) => {

    //Pega todas as informações da lista atual
    let list = await _trello.list('all');

    //Pega o tipo da lista atual
    let listType = utils.getListType(list.id);

    //Se não encontrar o tipo de lista retorna null
    if(!listType) {
        return;
    }

    //De acordo com o tipo da lista, chama a função que retorna seus action buttons de estatisticas
    switch(listType){
        case LIST_TYPES.Done: {
            return getDoneListStatisticsActionButton(list); 
        }
    }
}

const getDoneListStatisticsActionButton = async (list) => {

    //Inicializa o array de botoes de ação da lista
    let statisticsActionButtons = [];

    //Adiciona botão de estatísticas
    statisticsActionButtons.push({
        text: "Mostrar estatísticas...",
        callback: function (t) {
            //Mostra pop up com as estatísticas
            return t.boardBar({
                title: "Estatísticas",
                url: 'views/statistics/statistics.html',
                height: 1200,
                args: { 
                    list: list
                }
            });
        }
    });
    
    return statisticsActionButtons;
}

const listActionButtons = { 
    getListActionButtons: async (trello, options) => {

        //Inicializa o array de botoes de ação da lista
        let listActionButtons = [];

        //Salva todos os cards do board de forma global
        _boardCards = await trello.cards('all');
    
        //Salva todos as listas do board de forma global
        _boardLists = await trello.lists('all');
        
        //Retorna os botoes de ação da lista
        let statisticsButtons = await getListStatisticsActionButtons(trello) || [];
        listActionButtons = listActionButtons.concat(statisticsButtons);
    
        return listActionButtons;
    }
}

export default listActionButtons;
const getStatisticsBoardButtons = (list) => {

    //Inicializa o array de botoes de ação da lista
    let statisticsBoardButtons = [];

    //Adiciona botão de estatísticas
    statisticsBoardButtons.push({
        text: "Mostrar estatísticas gerais...",
        callback: function (t) {
            //Mostra pop up com as estatísticas
            return t.boardBar({
                title: "Estatísticas gerais",
                url: 'views/statistics/statistics.html',
                height: 1200,
                args: { 
                    list: {cards : _boardCards}
                }
            });
        }
    });
    
    return statisticsBoardButtons;
}


const boardButtons = { 
    getBoardButtons: async (trello, options) => {

        //Inicializa o array de botoes de ação da lista
        let boardButtons = [];

        //Salva todos os cards do board de forma global
        _boardCards = await trello.cards('all');
    
        //Salva todos as listas do board de forma global
        _boardLists = await trello.lists('all');
        
        //Retorna os botoes de ação da lista
        let statisticsBoardButtons = getStatisticsBoardButtons(trello) || [];
        boardButtons = boardButtons.concat(statisticsBoardButtons);
    
        return boardButtons;
    }
}

export default boardButtons;
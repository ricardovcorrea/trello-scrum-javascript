import utils from '../../utils';

const summarizeMemberCards = (cards) => {
    return new Promise((resolve) => {
        let membersSummary = [];

        for (let card of cards) {
            let cardMember = card.members[0];

            var memberName = "Sobra " + utils.getCardTeam(card);

            if (cardMember)
                memberName = cardMember.fullName;

            let cardType = utils.getCardType(card);
            let existingMember = membersSummary.find(m => m.name == memberName);
            if (!existingMember) {
                membersSummary.push({
                    name: memberName,
                    [cardType]: [card],
                    historiesEstimated: 0,
                    historiesDone: 0,
                    bugHistoriesDone: 0,
                    pointsDone: 0,
                    hoursDone: 0,
                    tasksDone: 0,
                    bugTasksDone: 0,
                    bugHoursDone: 0,
                    totalTeam: {
                        
                        "Android": {
                            historiesEstimated:0,
                            historiesDone: 0,
                            bugHistoriesDone: 0,
                            pointsDone: 0,
                            hoursDone: 0,
                            tasksDone: 0,
                            bugTasksDone: 0,
                            bugHoursDone: 0
                        },
                        "IOS": {
                            historiesEstimated: 0,
                            historiesDone: 0,
                            bugHistoriesDone: 0,
                            pointsDone: 0,
                            hoursDone: 0,
                            tasksDone: 0,
                            bugTasksDone: 0,
                            bugHoursDone: 0
                        },
                        "Backend": {
                            historiesEstimated: 0,
                            historiesDone: 0,
                            bugHistoriesDone: 0,
                            pointsDone: 0,
                            hoursDone: 0,
                            tasksDone: 0,
                            bugTasksDone: 0,
                            bugHoursDone: 0
                        }
                    }
                });
            }
            else {
                if (existingMember[cardType]) {
                    existingMember[cardType].push(card)
                }
                else {
                    existingMember[cardType] = [card];
                }
            }

        }

        resolve(membersSummary);
    });
}

const summarizeMembersStatistics = (cards) => {
    return summarizeMemberCards(cards).then((memberStatistics) => {
        for (let member of memberStatistics) {
            if (member.history && member.history.length) {

                member.historiesDone = member.history.length;

                for (let i = 0; i < member.historiesDone; i++) {
                    let card = member.history[i];
                    let cardStats = utils.getCardEstimatedSpent(card);
                    let isbugCard = utils.isBugCard(card);
                    let cardTeam = utils.getCardTeam(card);

                    if (isbugCard) {
                        member.bugHistoriesDone++;

                        if (cardTeam != null)
                            member.totalTeam[cardTeam].bugHistoriesDone++;
                    }

                    if (cardStats.estimated) {
                        member.historiesEstimated += cardStats.estimated;

                        if (cardTeam != null)
                            member.totalTeam[cardTeam].historiesEstimated += cardStats.estimated;
                    }

                    if (cardStats.spent) {
                        member.pointsDone += cardStats.spent;

                        if (cardTeam != null)
                            member.totalTeam[cardTeam].pointsDone += cardStats.spent;
                    }
                }
            }

            if (member.task && member.task.length) {
                member.tasksDone = member.task.length;

                for (let i = 0; i < member.tasksDone; i++) {
                    let card = member.task[i];
                    let cardStats = utils.getCardEstimatedSpent(card);
                    let isbugCard = utils.isBugCard(card);
                    let cardTeam = utils.getCardTeam(card);

                    if (isbugCard) {
                        member.bugTasksDone++;

                        if (cardTeam != null)
                            member.totalTeam[cardTeam].bugTasksDone++;

                        if (cardStats.spent) {
                            member.bugHoursDone += cardStats.spent;

                            if (cardTeam != null)
                                member.totalTeam[cardTeam].bugHoursDone += cardStats.spent;
                        }
                    }

                    if (cardStats.spent) {
                        member.hoursDone += cardStats.spent;

                        if (cardTeam != null)
                            member.totalTeam[cardTeam].hoursDone += cardStats.spent;
                    }
                }
            }
        }

        return memberStatistics;
    });
}

const calculateStatisticsTotals = (membersStatistics) => {
    return new Promise((resolve) => {
        let totalizers = {
            totalPoints: 0,
            pointsExecuted: 0,
            hoursExecuted: 0,
            paidHours: 0,
            freeHours: 0,
            IOS: {
                totalPoints: 0,
                pointsExecuted: 0,
                hoursExecuted: 0,
                paidHours: 0,
                freeHours: 0
            },
            Android: {
                totalPoints: 0,
                pointsExecuted: 0,
                hoursExecuted: 0,
                paidHours: 0,
                freeHours: 0
            },
            Backend: {
                totalPoints: 0,
                pointsExecuted: 0,
                hoursExecuted: 0,
                paidHours: 0,
                freeHours: 0
            }
        };

        for (let member of membersStatistics) {
            totalizers.totalPoints += member.historiesEstimated || 0;
            totalizers.pointsExecuted += member.pointsDone || 0;
            totalizers.hoursExecuted += member.hoursDone || 0;
            totalizers.freeHours += member.bugHoursDone || 0;


            //Times:
            totalizers.IOS.totalPoints += member.totalTeam["IOS"].historiesEstimated || 0;
            totalizers.IOS.pointsExecuted += member.totalTeam["IOS"].pointsDone || 0;
            totalizers.IOS.hoursExecuted += member.totalTeam["IOS"].hoursDone || 0;
            totalizers.IOS.freeHours += member.totalTeam["IOS"].bugHoursDone || 0;

            totalizers.Android.totalPoints += member.totalTeam["Android"].historiesEstimated || 0;
            totalizers.Android.pointsExecuted += member.totalTeam["Android"].pointsDone || 0;
            totalizers.Android.hoursExecuted += member.totalTeam["Android"].hoursDone || 0;
            totalizers.Android.freeHours += member.totalTeam["Android"].bugHoursDone || 0;

            totalizers.Backend.totalPoints += member.totalTeam["Backend"].historiesEstimated || 0;
            totalizers.Backend.pointsExecuted += member.totalTeam["Backend"].pointsDone || 0;
            totalizers.Backend.hoursExecuted += member.totalTeam["Backend"].hoursDone || 0;
            totalizers.Backend.freeHours += member.totalTeam["Backend"].bugHoursDone || 0;

        }

        totalizers.paidHours = totalizers.hoursExecuted - totalizers.freeHours;

        //Times:
        totalizers.IOS.paidHours = totalizers.IOS.hoursExecuted - totalizers.IOS.freeHours;
        totalizers.Android.paidHours = totalizers.Android.hoursExecuted - totalizers.Android.freeHours;
        totalizers.Backend.paidHours = totalizers.Backend.hoursExecuted - totalizers.Backend.freeHours;

        resolve(totalizers);
    })
}

const renderMembersStatistics = (membersStatistics) => {
    let table = document.getElementById("statistics-table");
    table.innerHTML = membersStatistics.reduce((html, member) => {
        return html += `<tr>
                    <td>${member.name}</td>
                    <td>${member.historiesDone.toFixed(0)}</td>
                    <td>${member.bugHistoriesDone.toFixed(0)}</td>
                    <td>${member.historiesEstimated.toFixed(0)}</td>
                    <td>${member.pointsDone.toFixed(0)}</td>
                    <td>${member.tasksDone.toFixed(0)}</td>
                    <td>${member.bugTasksDone.toFixed(0)}</td>
                    <td>${member.hoursDone.toFixed(0)}</td>
                    <td>${member.bugHoursDone.toFixed(0)}</td>
                </tr>`;
    }, "");
}

const renderStatisticsTotals = async (totalizers) => {
    let table = document.getElementById("statistics-total-table");
    table.innerHTML = ` <tr>
                            <td>${totalizers.totalPoints.toFixed(1)}</td>
                            <td>${totalizers.pointsExecuted.toFixed(1)}</td>
                            <td>${totalizers.hoursExecuted.toFixed(1)}</td>
                            <td>${totalizers.paidHours.toFixed(1)}</td>
                            <td>${totalizers.freeHours.toFixed(1)}</td>
                        </tr>`;

    let tableIOS = document.getElementById("statistics-total-IOS-table");
    tableIOS.innerHTML = ` <tr>
                            <td>${totalizers.IOS.totalPoints.toFixed(1)}</td>
                            <td>${totalizers.IOS.pointsExecuted.toFixed(1)}</td>
                            <td>${totalizers.IOS.hoursExecuted.toFixed(1)}</td>
                            <td>${totalizers.IOS.paidHours.toFixed(1)}</td>
                            <td>${totalizers.IOS.freeHours.toFixed(1)}</td>
                        </tr>`;

    let tableAndroid = document.getElementById("statistics-total-Android-table");
    tableAndroid.innerHTML = ` <tr>
                            <td>${totalizers.Android.totalPoints.toFixed(1)}</td>
                            <td>${totalizers.Android.pointsExecuted.toFixed(1)}</td>
                            <td>${totalizers.Android.hoursExecuted.toFixed(1)}</td>
                            <td>${totalizers.Android.paidHours.toFixed(1)}</td>
                            <td>${totalizers.Android.freeHours.toFixed(1)}</td>
                        </tr>`;

    let tableBackend = document.getElementById("statistics-total-Backend-table");
    tableBackend.innerHTML = ` <tr>
                            <td>${totalizers.Backend.totalPoints.toFixed(1)}</td>
                            <td>${totalizers.Backend.pointsExecuted.toFixed(1)}</td>
                            <td>${totalizers.Backend.hoursExecuted.toFixed(1)}</td>
                            <td>${totalizers.Backend.paidHours.toFixed(1)}</td>
                            <td>${totalizers.Backend.freeHours.toFixed(1)}</td>
                        </tr>`;
}

let _trello = TrelloPowerUp.iframe();
_trello.render(async () => {
    let list = _trello.args[1].list;

    summarizeMembersStatistics(list.cards).then((membersStatistics) => {

        renderMembersStatistics(membersStatistics);

        calculateStatisticsTotals(membersStatistics).then((totalizers) => {
            renderStatisticsTotals(totalizers);
        });

    });
});

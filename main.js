'use strict'

var Game = (function() {
    //разобраться с публичным/приватным
    var game = {
        wins: 0,
        sequence: [3, 2, 1, 0, 0, 0, 1],
        colors: ['green', 'red', 'yellow', 'blue'],
        getRandom: function() {
            var rand = Math.round(Math.random() * 3)
            this.sequence.push(rand);
        },
    };

    return {
        getSetting: function() {
            return game;
        }
    };
})();

function computerMove() {
    var game = Game.getSetting();
    var iterator = 0;

    function switchColor() {
        var colorIndex = game.sequence[iterator];
        var color = game.colors[colorIndex];
        var modifierClass = 'outer-round__item--' + color + '-active';
        if (!game.sectorList[colorIndex].classList.contains(modifierClass)) {
            game.sectorList[colorIndex].classList.toggle(modifierClass);
            runSequence = setTimeout(switchColor, 500);
        } else {
            game.sectorList[colorIndex].classList.toggle(modifierClass);
            var colorIndex = game.sequence[iterator++];
            if (iterator < game.sequence.length) {
                runSequence = setTimeout(switchColor, 500);
            }
        }
    }
    var runSequence = setTimeout(switchColor, 500);
}

function playerMove() {
    var game = Game.getSetting();
    var iterator = 0;
    function clickRecorder(event) {
        
    }
    [].forEach.call(game.sectorList, function(item) {
      item.addEventListener('click', clickRecorder);
    });
}

function isLost() {
    return (Game.getSetting().wins === 0) ? true : false;
}

function start() {
    // do {
        computerMove();
        playerMove();
    // } while (isLost());
}

var btn = document.getElementsByClassName('inner-round__btn')[0];
Game.getSetting().sectorList = document.getElementsByClassName('outer-round__item');
btn.addEventListener('click', start);

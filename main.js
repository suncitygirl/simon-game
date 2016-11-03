'use strict';

var Game = (function() {
    var game = {
        wins: 0,
        sequence: [],
        colors: ['green', 'red', 'yellow', 'blue'],
        isRunning: function() {
            console.log(this.sequence.length);
            if (this.sequence.length === 0) return false;
            else return true;
        },
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

//an entry point
(function() {
    var btn = document.getElementsByClassName('inner-round__btn')[0];
    Game.getSetting().sectorList = document.getElementsByClassName('outer-round__item');
    btn.addEventListener('click', start);
})();

function start() {
    if (Game.getSetting().isRunning()) return;
    changeClickability();
    clearGame();
    computerMove();
    playerMove();
}

function clearGame() {
    changeClickability();
    var game = Game.getSetting();
    game.wins = 0;
    game.sequence = [];
    renderCounter();
}

//Make user not to be allowed to click on buttons during anumation
function changeClickability() {
    var round = document.getElementsByClassName('outer-round')[0];
    if (round.style.pointerEvents === 'auto') {
        round.style.pointerEvents = 'none';
    } else {
        round.style.pointerEvents = 'auto';
    }
}

function renderCounter() {
    var counter = document.getElementsByClassName('inner-round__counter')[0];
    var game = Game.getSetting();
    counter.textContent = game.wins;
}

function computerMove() {
    var game = Game.getSetting();
    game.getRandom();
    // changeClickability()
    var i = 0;
    var runSequence = setTimeout(Animate, 400);

    //It is gonna be a little bit simplier to read
    //Refactor it later
    function Animate() {
        var colorIndex = game.sequence[i];
        var color = game.colors[colorIndex];
        var modifierClass = 'outer-round__item--' + color + '-active';
        if (!game.sectorList[colorIndex].classList.contains(modifierClass)) {
            game.sectorList[colorIndex].classList.toggle(modifierClass);
            game.sectorList[colorIndex].firstElementChild.play();
            runSequence = setTimeout(Animate, 400);
        } else {
            game.sectorList[colorIndex].classList.toggle(modifierClass);
            var colorIndex = game.sequence[i++];
            if (i < game.sequence.length) {
                runSequence = setTimeout(Animate, 400);
            } else {
                changeClickability();
            }
        }
    }
}

function playerMove() {
    var game = Game.getSetting();
    var i = 0;
    var round = document.getElementsByClassName('outer-round')[0];

    function isInCircle(elem, x, y) {
        var rect = elem.getBoundingClientRect()
        var radius = (rect.bottom - rect.top) / 2;
        var centerX = (rect.right - rect.left) / 2 + rect.left;
        var centerY = (rect.bottom - rect.top) / 2 + rect.top;
        //Simply calculating a distance between the point with
        //click coords and the center point of outer-round circle
        //To make sure (x, y) is inside the circle we compare it with the radius
        //Here is a formula:
        if (Math.sqrt(Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2)) <= radius) {
            return true;
        } else {
            return false;
        }
    }

    function renderMistake(elem) {
        elem.style.backgroundColor = '#fce4ec';
        setTimeout(function() {
            elem.style.backgroundColor = '';
        }, 1000);
    }

    function clickChecker(clicked) {
        if (clicked == game.sectorList[game.sequence[i]]) {
            if (i == game.sequence.length - 1) {
                game.wins++;
                renderCounter();
                i = 0;
                changeClickability()
                setTimeout(computerMove, 700);
            } else {

                i++;
            }
        } else {
            [].forEach.call(game.sectorList, function(sector) {
                sector.removeEventListener('click', clickRecorder);
                renderMistake(sector);
            });
            clearGame();
        }
    }

    function clickRecorder(event) {
        if (isInCircle(round, event.clientX, event.clientY)) {
            this.firstElementChild.play();
            clickChecker(this);
        }
    }
    [].forEach.call(game.sectorList, function(sector) {
        sector.addEventListener('click', clickRecorder);
    });
}

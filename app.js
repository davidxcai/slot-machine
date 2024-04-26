$(() => {
    const symbols = new Map();
symbols.set('0', '💣');
symbols.set('1', '🍒');
symbols.set('2', '🍇');
symbols.set('3', '🍋');
symbols.set('4', '🍊');
symbols.set('5', '🍌');
symbols.set('6', '🍉');
symbols.set('7', '🔔');
symbols.set('8', '7️⃣');
symbols.set('9', '💰');

let
    jackpot = 1000000,
    total = 100,
    previousTotal = 100,
    losses = 0,
    winnings = 0,
    denomination = 1,
    output = [];

$(".denomination").click(function () {
    denomination = Number(this.value);
});

$("#pullButton").click(function () {
    previousTotal = total;
    spin();
    check();
    updateDisplay();
});

function check() {
    const 
        allMatchingNumbers = output.every(number => number === output[0]),
        containsZero = output.filter(number => number === 0).length,
        containsNine = output.filter(number => number === 9).length,
        containsEight = output.filter(number => number === 8).length;
        
    const smallestNumber = input => {
        copies = output.every(number => number === Math.min(...output)).length;
        if (copies === 2) {
            return Math.floor((Math.min(...output) + input) / 2);
        }
        else {
            return (input - 4);
        }
    };
    
    let amount = 0;

    // Check if all numbers match or partial matches
    if (allMatchingNumbers) {
        if (output[0] === 0) {
            console.log('bomb exploded')
            losses += previousTotal - total;
            jackpot += (total + denomination);
        }
        else {
            total += payout(output[0]);
            if (output[0] === 9) {
                console.log('JACKPOT!')
                jackpot = 0;
            }
        }
    }
    else if (containsNine === 2) {
        amount = payout(6)
    }
    else if (containsNine === 1) {
        amount = payout(smallestNumber(9))
    }
    else if (containsEight === 2) {
        amount = payout(5);
    }
    else if (containsEight === 1) {
        amount = payout(smallestNumber(8));
    }
    else {
        if (containsZero === 2) {
            total = (total * 0.5);
        }
        else if (containsZero === 1) {
            total = (total * 0.75)
        }
        else {
            total -= denomination;
            losses += denomination;
            jackpot += denomination;
        }
    }

    // Update total
    if (amount > 0) {
        // Check for bombs
        if (containsZero === 2) {
            amount = Math.floor(amount * 0.5);
        }
        else if (containsZero === 1) {
            amount = Math.floor(amount * 0.75)
        }
        total += amount;
        console.log('win')
        winnings += total - previousTotal;
    }
}

function payout(number) {
    switch (number) {
        case 1: return (denomination * 5);
        case 2: return (denomination * 10);
        case 3: return (denomination * 25);
        case 4: return (denomination * 50);
        case 5: return (denomination * 100);
        case 6: return (denomination * 1000);
        case 7: return (denomination * 10000);
        case 8: return (denomination * 100000);
        case 9: return jackpot;
        default: return 0
    }
}

function spin() {
    for (let i = 0; i < 3; i++) {
        output[i] = Math.floor(Math.random() * 10);
    }
}

function updateDisplay() {
    $("#jackpot").text("$" + jackpot);
    $("#total").text("$" + total);
    $("#losses").text("$" + losses);
    $("#winnings").text("$" + winnings);
    $("#display1").html(`<h1>${symbols.get(output[0].toString())}</h1>`);
    $("#display2").html(`<h1>${symbols.get(output[1].toString())}</h1>`);
    $("#display3").html(`<h1>${symbols.get(output[2].toString())}</h1>`);
}
})
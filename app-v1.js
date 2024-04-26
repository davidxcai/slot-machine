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
        symbols.set('10', '💀');

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

    function spin() {
        for (let i = 0; i < 3; i++) {
            output[i] = Math.floor(Math.random() * 11);
        }
    }

    function check() {
        // are there matches
        //if not, try the losses
        const 
            containsZero = output.filter(number => number === 0).length,
            containsDeath = output.filter(number => number === 10).length;

        // Check if all numbers match or partial matches
        let amount = winCases();

        if (amount === 0) {
            loseCases(containsDeath, containsZero);
        }
        // Update total
        if (amount > 0) {
            updateTotal(amount, containsZero)
        }
    }

    function winCases() {
        const
            allMatchingNumbers = output.every(number => number === output[0]),
            containsEight = output.filter(number => number === 8).length,
            containsNine = output.filter(number => number === 9).length;

        if (allMatchingNumbers) {
            // All bombs
            if (output[0] === 0) {
                console.log('bomb exploded')
                total -= 100000;
                losses += previousTotal - total;
                jackpot += (total + denomination);
                return 0;
            }
            else if (output[0] === 10) {
                total = 0
                losses += previousTotal - total;
                jackpot += (total + denomination);
                return 0;
            }
            else {
                if (output[0] === 9) {
                    console.log('JACKPOT!')
                    jackpot = 0;
                }
                return payout(output[0]);
            }
        }
        else if (containsNine === 2) {
            return payout(6)
        }
        else if (containsNine === 1) {
            return payout(smallestNumber(9))
        }
        else if (containsEight === 2) {
            return payout(5);
        }
        else if (containsEight === 1) {
            return payout(smallestNumber(8));
        }
    }

    function smallestNumber(input) {
        copies = output.every(number => number === Math.min(...output)).length;
        if (copies === 2) {
            return Math.floor((Math.min(...output) + input) / 2);
        }
        else {
            return (input - 4);
        }
    };

    function loseCases(containsDeath, containsZero) {
        if (containsDeath === 2) {
            total -= 10000
            if (containsZero === 1) {
                total = Math.floor(total * 0.5)
            }
        }
        if (containsDeath === 1) {
            total -= 1000
            if (containsZero === 2) {
                total = Math.floor(total * 0.25)
            }
        }
        if (containsZero === 2) {
            total = Math.floor(total * 0.25);
            losses += previousTotal - total;
            jackpot += previousTotal - total;
        }
        else if (containsZero === 1) {
            total = Math.floor(total * 0.5)
            losses += previousTotal - total;
            jackpot += previousTotal - total;
        }
        else {
            total -= denomination;
        }
        losses += denomination;
        jackpot += denomination;
    }

    function payout(number) {
        switch (number) {
            case 1: return (denomination * 1);
            case 2: return (denomination * 5);
            case 3: return (denomination * 10);
            case 4: return (denomination * 25);
            case 5: return (denomination * 50);
            case 6: return (denomination * 100);
            case 7: return (denomination * 1000);
            case 8: return (denomination * 10000);
            case 9: return jackpot;
            default: return 0
        }
    }

    function updateTotal(amount, containsZero) {
        finalAmount = amount;
        // Check for bombs
        if (containsZero === 2) {
            finalAmount = Math.floor(amount * 0.5);
        }
        else if (containsZero === 1) {
            finalAmount = Math.floor(amount * 0.75)
        }
        total += finalAmount;
        console.log('win')
        winnings += total - previousTotal;
    }

    function updateDisplay() {
        function format(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $("#jackpot").text("$" + format(jackpot));
        $("#total").text("$" + format(total));
        $("#losses").text("$" + format(losses));
        $("#winnings").text("$" + format(winnings));
        $("#display1").html(`<h1>${symbols.get(output[0].toString())}</h1>`);
        $("#display2").html(`<h1>${symbols.get(output[1].toString())}</h1>`);
        $("#display3").html(`<h1>${symbols.get(output[2].toString())}</h1>`);
    }
})
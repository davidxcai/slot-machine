$(() => {
    const symbols = new Map();
        symbols.set('0', '💀');
        symbols.set('1', '🍒');
        symbols.set('2', '🍇');
        symbols.set('3', '🍋');
        symbols.set('4', '🍊');
        symbols.set('5', '🍌');
        symbols.set('6', '🍉');
        symbols.set('7', '🔔');
        symbols.set('8', '7️⃣');
        symbols.set('9', '💰');
        symbols.set('10', '💣');

    let
        jackpot = 1000000,
        total = 100,
        previousTotal = 100,
        losses = 0,
        winnings = 0,
        denomination = 1,
        result = [];

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
            result[i] = Math.floor(Math.random() * 11);
        }
    }

    function check() {
        let amount = winCombinations();
        console.log(amount)
        amount = loseCombinations(amount);

        updateTotal(amount);
    }

    function winCombinations() {
        const
            allMatchingNumbers = result.every(number => number === result[0]),
            containsEight = result.filter(number => number === 8).length,
            containsNine = result.filter(number => number === 9).length;

        if (allMatchingNumbers) {
            return payout(result[0]);
        } 
        else if (result.includes(9)) {
            return (containsNine === 2) ? payout(7) : payout(6);
        } 
        else if (result.includes(8)) {
            return (containsEight === 2) ? payout(5) : payout(4);
        }
        else {
            return (0 - denomination);
        }
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

    function loseCombinations(amount) {
        let updateAmount = amount;

        const 
            containsZero = result.filter(number => number === 0).length,
            containsTen = result.filter(number => number === 10).length;

        // check if results contains skulls
        if (result.includes(0)) {
            let multiplier = number => {
                if (total < 0) {
                    return number * 10
                }
                else {
                    return number
                }
            }
            // No winnings affects your total, otherwise affects your earned winnings
            if (amount <= 0) {
                if (containsZero === 3) {
                    updateAmount = (0 - total);
                }
                // returns a negative number
                updateAmount = (containsZero === 2) ? (total * multiplier(0.25)) - total : (total * multiplier(0.5)) - total;
            }
            else {
                updateAmount = (containsZero === 2) ? amount * multiplier(0.25) : amount * multiplier(0.5);
            }
        } 
        // check if results contains bombs
        if (result.includes(10)) {
            if (containsTen === 3) {
                updateAmount -= 1000;
            }
            else if (containsTen === 2) {
                updateAmount -= 750;
            }
            else {
                updateAmount -= 500;
            }
        }

        return Math.floor(updateAmount);
    }

    function updateTotal(amount) {
        total += amount;
        if (total > previousTotal) {
            winnings += total - previousTotal;
        }
        else if (previousTotal > total) {
            losses += previousTotal - total;
            jackpot += previousTotal - total;
        }
    }

    function updateDisplay() {
        function format(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        $("#jackpot").text("$" + format(jackpot));
        $("#total").text("$" + format(total));
        $("#losses").text("$" + format(losses));
        $("#winnings").text("$" + format(winnings));
        $("#display1").html(`<h1>${symbols.get(result[0].toString())}</h1>`);
        $("#display2").html(`<h1>${symbols.get(result[1].toString())}</h1>`);
        $("#display3").html(`<h1>${symbols.get(result[2].toString())}</h1>`);
    }
})
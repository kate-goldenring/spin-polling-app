function option(number) {
    const options = {
        method: 'POST'
    }
    const query = '../api?option=option' + number;
    fetch(query, options).then(response => response.text()).then(body => {
        document.getElementById("vote" + number).innerHTML = body;
    });

    refresh_chart();
}

const btn = document.querySelector('button[type="option1"');
btn.addEventListener("click", function () { option("1") });

const btn2 = document.querySelector('button[type="option2"');
btn2.addEventListener("click", function () { option("2") });


var xValues = ["Chocolate", "Vanilla"];
var yValues = [0, 0];
var barColors = ["brown", "#EF946C"];

var chart = new Chart(document.getElementById("votes"), {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            },
        },
        plugins: {
            legend: {
                display: false
            }
        }

    }
});

function refresh_chart() {
    let option1 = document.getElementById("vote1").innerHTML;
    let option2 = document.getElementById("vote2").innerHTML;
    let newYValues = [option1, option2];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = newYValues;
    });
    chart.update();
}

setInterval(async function () {
    var numbers = [1, 2];
    for (i = 1; i < 3; i++) {
        var query = '../api?option=option' + i;
        await fetch(query).then(response => response.text()).then(body => {
            document.getElementById("vote" + i).innerHTML = body;
        });
    }
    refresh_chart();
}, 1000);

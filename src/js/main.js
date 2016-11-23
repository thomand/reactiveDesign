$(document).ready(function() {
    init();
    var gaugeChart;
    var chart;
});

function init() {

    chart = AmCharts.makeChart("chartdiv", {
        "type": "serial",
        "theme": "light",
        "color":"#FFFFFF",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled":true,
        "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth":true
        }],
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
        },
        "graphs": [{
            "id": "g1",
            "lineColor":"#F95372",
            //"useNegativeColorIfDown": true,
            "negativeBase":1000,
            "negativeLineColor": "#8BD25F",
            "balloon":{
                "drop":true,
                "adjustBorderColor":false,
                "color":"#ffffff"
            },
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "value",
            "balloonText": "<span style='font-size:14px;'>[[value]]</span>"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis":false,
            "offset":30,
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA"
        },
        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha":1,
            "cursorColor":"#258cbb",
            "limitToGraph":"g1",
            "valueLineAlpha":0.2,
            "valueZoomable":true
        },
        "valueScrollbar":{
            "oppositeAxis":false,
            "offset":50,
            "scrollbarHeight":10
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "minPeriod": "ss",
            "dashLength": 1,
            "minorGridEnabled": true
        },

        "dataProvider": []
    });
    chart.addListener("rendered", zoomChart);
    zoomChart();
    gaugeChart = AmCharts.makeChart( "gaugediv", {
        "type": "gauge",
        "theme": "light",
        "color":"#FFFFFF",
        "axes": [ {
            "axisThickness": 1,
            "axisAlpha": 0.2,
            "tickAlpha": 0.2,
            "valueInterval": 200,
            "bands": [ {
                "color": "#84b761",
                "endValue": 800,
                "startValue": 0
            }, {
                "color": "#fdd400",
                "endValue": 1200,
                "startValue": 800
            }, {
                "color": "#cc4748",
                "endValue": 2000,
                "innerRadius": "95%",
                "startValue": 1200
            } ],
            "bottomText": "0 ppm",
            "bottomTextYOffset": -20,
            "endValue": 2000
        } ],
        "arrows": [ {} ],
        "export": {
            "enabled": false
        }
    } );


    var config = {
        apiKey: "AIzaSyAYd5et1PRcQu1Rc3swVQrPTHnSzY1gLDc",
        authDomain: "reactivedesign-179e8.firebaseapp.com",
        databaseURL: "https://reactivedesign-179e8.firebaseio.com",
        storageBucket: "reactivedesign-179e8.appspot.com",
        messagingSenderId: "532586160358"
    };
    firebase.initializeApp(config);

    // Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref("/db/");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        //console.log(data);
        update(data);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    //setInterval(setWarning,5000);
}

function zoomChart() {
    chart.zoomToIndexes(0, chart.dataProvider.length - 1);
}


function setWarning() {
    var val = gaugeChart.arrows[0].value;
    if (val > 1000) {
        document.getElementById("warningText").innerHTML = "The value of " + val + " ppm is above recommended value of 1000 ppm!";
        document.getElementById("warning").style.display = "block";
    }
    else {
        document.getElementById("warning").style.display = "none";
    }
}

function setGaugeValue(value) {
    if ( gaugeChart ) {
        if ( gaugeChart.arrows ) {
            if ( gaugeChart.arrows[ 0 ] ) {
                if ( gaugeChart.arrows[ 0 ].setValue ) {
                    gaugeChart.arrows[ 0 ].setValue( value );
                    gaugeChart.axes[ 0 ].setBottomText( "Currently " + value + " ppm" );
                    setWarning();
                }
            }
        }
    }
}

function update(data) {
    var dict = [];
    for (var element in data) {
        if (data.hasOwnProperty(element)) {
            //console.log(element);
            var entry = data[element];
            //console.log(entry);
            dict.push({"date":entry.time, "value": entry.value});
        }
    }
            chart.dataProvider = dict;
            chart.validateData();
            setGaugeValue(chart.dataProvider[chart.dataProvider.length-1].value);
}



/*function randomValue2() {
    var now = new Date();
    var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*1));
    var time = nd.toTimeString().substring(0,8);
    var dateString = nd.toJSON().substring(0,10) + " " + time;
    var value = getRandomArbitrary(0, 2000);
    console.log(dateString);

    chart.dataProvider.push( {"date":dateString,
        "value": value});
    chart.validateData();
    setGaugeValue(chart.dataProvider[chart.dataProvider.length-1].value);
}

function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
}
randomValue2();
setInterval(randomValue2,10000);
*/

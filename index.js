// loader settings
var opts = {
    lines: 9, // The number of lines to draw
    length: 9, // The length of each line
    width: 5, // The line thickness
    radius: 14, // The radius of the inner circle
    color: '#EE3124', // #rgb or #rrggbb or array of colors
    speed: 0.1, // Rounds per second
    trail: 40, // Afterglow percentage
    className: 'spinner', // The CSS class to assign to the spinner
};

var margin = {top: 50, right: 100, bottom: 100, left: 100},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

// The svg
var svg = d3.select("body").append("svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" " +(height + margin.top + margin.bottom))
    .classed("svg-content-responsive", true);

// Map and projection
var projection = d3.geoMercator()
    .scale(180)
    .translate([(width) / 2,  (height) / 1.3])


// A path generator
var path = d3.geoPath()
    .projection(projection)


// Initialize spinner
var spinner = new Spinner(opts).spin(document.getElementById("chart"));


var promises = [];
promises.push(d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"));
promises.push(d3.csv("./codes.csv"));
promises.push(d3.csv("./flightlistJanuary.csv"));
promises.push(d3.csv("./flightlistFebruary.csv"));
promises.push(d3.csv("./flightlistMarch.csv"));

Promise.all(promises).then(function(values) {
    ready(values[0], values[1], values[2], values[3], values[4])
});

function ready(dataGeo, codes, flightsJanuary, flightsFebruary, flightsMarch) {
    let codeToCoordinate = {};
    codes.forEach(function (row) {
        codeToCoordinate[row.ident] = row.coordinates.split(",")
    });

    console.log("READY");
    //Stop the spinner once the data is loaded and display the components
    spinner.stop();

    var januaryDataDict = dataDictionary(flightsJanuary, codeToCoordinate),
        februaryDataDict = dataDictionary(flightsFebruary, codeToCoordinate),
        marchDataDict = dataDictionary(flightsMarch, codeToCoordinate);

    // Initialise default timeline to all months
    var formatDate = d3.timeFormat("%m/%d/%y");
    var startDate = new Date("2020-01-01 00:00:00+00:00") ,
        endDate = new Date("2020-03-31 00:00:00+00:00");

    var monthStartAndEndDates = {
        'All months' : {
            start:'2020-01-01 00:00:00+00:00',
            end:'2020-03-31 00:00:00+00:00'
        },
        'January' : {
            start:'2020-01-01 00:00:00+00:00',
            end:'2020-01-31 00:00:00+00:00'
        },
        'February' : {
            start:'2020-02-01 00:00:00+00:00',
            end:'2020-02-29 00:00:00+00:00'
        },
        'March' : {
            start:'2020-03-01 00:00:00+00:00',
            end:'2020-03-31 00:00:00+00:00'
        }
    }

    $('.selectpicker').change(function () {
        var values = $('.selectpicker').val();

        switch(values.length){
            case 1:
                startDate = monthStartAndEndDates[values[0]].start;
                endDate = monthStartAndEndDates[values[0]].end;
                break;
            case _:
                startDate = monthStartAndEndDates[values[0]].start;
                endDate = monthStartAndEndDates[values[values.length-1]].end;
                break;
            default:
                break
        }
        createSlider(new Date(startDate), new Date(endDate))
    });
    var playButton = document.getElementById("playButton");
        playButton.style.visibility ="visible";
    var pauseButton = document.getElementById("pauseButton");
        pauseButton.style.visibility="visible";
        pauseButton.onclick = ()=> clearInterval(myTimer);




var x, handle, label, slider , line;
var svgSlider = svg
        .append("g")
        .attr("width", width )
        .attr("class", "apples")
        .attr("height", height );
createSlider(startDate, endDate);
function createSlider(startDate, endDate){
    // Setting up the slider
    // https://blockbuilder.org/officeofjane/9b9e606e9876e34385cc4aeab188ed73

    x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width])
        .clamp(true);

    slider = svgSlider.join("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    line = slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { updateSlider (x.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll(".text-labels")
        .data(x.ticks(10))
        .join("text")
        // .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDate(d); })
        .attr("class", "text-labels");

    handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    label = slider.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")
}





    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(dataGeo.features.filter(d => d.id !== "GRL" && d.id !== "ATA"))
        .enter().append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
        .style("stroke", "#fff")
        .style("stroke-width", 0)


    function updateSlider(h){
        var data = getCorrespondingMonthData(h)
        update(data[computeDate(h)]);
        handle.attr("cx", x(h));
        label
            .attr("x", x(h))
            .text(formatDate(h));
    }


    function update(data){
        svg.selectAll(".flight-line").data(data).join("path")
            .attr("d", function(d){ return path(d)})
            .style("fill", "none")
            .style("stroke", "#0077AB")
            .style("stroke-width", 0.1)
            .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
            .attr("class","flight-line");
    }

    // Initial date
    updateSlider(startDate);


    // Timer for going through slider
    var myTimer;
    playButton.onclick =  function() {
        clearInterval (myTimer);
        myTimer = setInterval (function() {
            var t = (+handle.attr("cx") + line.attr("x2")/91) % (+line.attr("x2"));
            if (t == 0) { t = 0; }
            var currentDate = x.invert(t)
            updateSlider(currentDate)
        }, 1000);
    };

    // Returns the flight dictionary from the current date
    function getCorrespondingMonthData(date){
        var month = date.getMonth()+1;
        switch (month){
            case 1:
                return januaryDataDict;
            case 2:
                return februaryDataDict;
            case 3:
                return marchDataDict;
            default:
                break
        }
    }
}

// Computes the data string to match the dataset
function computeDate(date){
    var dayNumber = date.getDate();
    var day = dayNumber < 10 ? "0"+dayNumber : dayNumber;
    var monthNumber = date.getMonth();
    var month = monthNumber < 10 ? "0"+ (monthNumber+1) : monthNumber+1;
    return "2020-"+month+"-"+day+" 00:00:00+00:00"
}

// Given a month flight dataset, it computes the list of flight coordinates
function dataDictionary(flights, codeToCoordinate){
    var data = {};
    flights.forEach(function(row){
        if (!data[row.day]){
            data[row.day] = []
        }
        else{
            let coordinateSource = codeToCoordinate[row.origin];
            let coordinateTarget = codeToCoordinate[row.destination];
            if (coordinateSource && coordinateTarget) {
                source = [coordinateSource[0], coordinateSource[1]];
                target = [coordinateTarget[0], coordinateTarget[1]]
                topush = {type: "LineString", coordinates: [source, target]}
                data[row.day].push(topush)
            }

        }
    });
    return data;
}
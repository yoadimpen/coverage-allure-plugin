'use strict';

var MyTabModel = Backbone.Collection.extend({
    url: 'data/coverage.json'
})

class MyLayout extends allure.components.AppLayout {

    initialize() {
        this.model = new MyTabModel();
    }

    loadData() {
        //return this.model.fetch();
    }

    getContentView() {
        return new MyView({items: this.model.attributes});
    }
}

const template = function (data) {

    var html = '<h3 class="pane__title">Coverage</h3>';
    return html;
}

var MyView = Backbone.Marionette.View.extend({
    template: template,

    render: function () {
        this.$el.html(this.template(this.options));
        return this;
    }
})

allure.api.addTab('coverage', {
    title: 'Coverage', icon: 'fa fa-pie-chart',
    route: 'coverage',
    onEnter: (function () {
        return new MyLayout()
    })
});

class MyWidget extends Backbone.Marionette.View {

    template(data) {
        return widgetTemplate(data)
    }

    serializeData() {
        return {
            items: this.model.get('items'),
        }
    }
}

/////////////////////

/*allure.api.addWidget('widgets', 'coverage', allure.components.WidgetStatusView.extend({
    rowTag: 'a',
    title: 'coverage',
    baseUrl: 'coverage',
    showAll: true
}));*/

/////////////////////

function formatPercentage(value){
    var res = "";

    var numbers = value.toFixed(2).toString().split(".");

    res = res + numbers[0].trim();

    if(numbers[1] != 0){
        res = res + "." + numbers[1].trim();
    }

    res = res + "%";

    return res;
}

/////////////////////

const template2 = function (data) {

    var html = "";

    /////////////////////

    var div = document.createElement("div");
    div.setAttribute("class", "container");

    /////////////////////

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "row");
    
    var titleCoverage = document.createElement("h2");
    titleCoverage.setAttribute("class", "widget__title");
    titleCoverage.appendChild(document.createTextNode("coverage"));

    /////////////////////
    
    var dataDiv = document.createElement("div");
    dataDiv.setAttribute("class", "row");
    dataDiv.setAttribute("style", "display: flex");

    /////////////////////

    var dataRow1 = document.createElement("div");
    dataRow1.setAttribute("class", "row");
    dataRow1.setAttribute("style", "margin-bottom: 5%");

    var levelChartDiv = document.createElement("div");
    levelChartDiv.setAttribute("class", "col");

    var levelChartCanvas = document.createElement("canvas");

    levelChartDiv.appendChild(levelChartCanvas);

    var levelctx = levelChartCanvas.getContext("2d");

    var gradient = levelctx.createLinearGradient(0, 0, 600, 0);
    gradient.addColorStop(0, '#fd5a3e');
    gradient.addColorStop(0.5, '#ffd050');
    gradient.addColorStop(1, '#97cc64');

    var levelChart = new Chart(levelctx, {
        type: 'horizontalBar',
        data: {
            labels:[ "Test Coverage Level"],
            datasets: [
                {
                    data: [this.model.attributes.coverageLevel],
                    backgroundColor: gradient
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontColor: '#000',
                fontSize: 18,
                text: 'Test Coverage Level'
            },
            legend: false,
            scales:{
                xAxes: [{
                    ticks: {
                        min: 0,
                        max: 7,
                        stepSize: 1,
                        fontSize: 14
                    },
                    gridLines:{
                        display: false,
                        zeroLineWidth: 0.5
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines:{
                        display: true,
                        zeroLineWidth: 1,
                        zeroLineColor: '#e5e5e5'
                    },
                    barPercentage: 0.75,
                    categoryPercentage: 1
                }]
            },
            aspectRatio:6
        }
    })

    dataRow1.appendChild(levelChartDiv);

    /////////////////////

    var dataRow2 = document.createElement("div");
    dataRow2.setAttribute("class", "row");
    dataRow2.setAttribute("style", "margin-bottom: 5%; display: flex; position: relative;");

    var totalChartDiv = document.createElement("div");
    totalChartDiv.setAttribute("class", "col");
    totalChartDiv.setAttribute("style", "width: 33.3%");

    var p1 = document.createElement("p");
    p1.setAttribute("class", "graph-inner-text");
    p1.setAttribute("id", "cov-graph-1");
    p1.appendChild(document.createTextNode(formatPercentage(this.model.attributes.totalCoverage)));

    var inputChartDiv = document.createElement("div");
    inputChartDiv.setAttribute("class", "col");
    inputChartDiv.setAttribute("style", "width: 33.3%");

    var p2 = document.createElement("p");
    p2.setAttribute("class", "graph-inner-text");
    p2.setAttribute("id", "cov-graph-2");
    p2.appendChild(document.createTextNode(formatPercentage(this.model.attributes.inputCoverage)));

    var outputChartDiv = document.createElement("div");
    outputChartDiv.setAttribute("class", "col");
    outputChartDiv.setAttribute("style", "width: 33.3%");

    var p3 = document.createElement("p");
    p3.setAttribute("class", "graph-inner-text");
    p3.setAttribute("id", "cov-graph-3");
    p3.appendChild(document.createTextNode(formatPercentage(this.model.attributes.outputCoverage)));

    var inputChartCanvas = document.createElement("canvas");
    var outputChartCanvas = document.createElement("canvas");
    var totalChartCanvas = document.createElement("canvas");

    inputChartDiv.appendChild(inputChartCanvas);
    outputChartDiv.appendChild(outputChartCanvas);
    totalChartDiv.appendChild(totalChartCanvas);

    var totalctx = totalChartCanvas.getContext("2d");
    var inputctx = inputChartCanvas.getContext("2d");
    var outputctx = outputChartCanvas.getContext("2d");

    var totalChart = new Chart(totalctx, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [this.model.attributes.totalCoverage.toFixed(2), (100-this.model.attributes.totalCoverage).toFixed(2)],
                    backgroundColor: [
                        'rgb(151, 204, 100)',
                        'rgb(253, 90, 62)'
                    ]
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontColor: '#000',
                fontSize: 16,
                text: 'Total Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 1
        }
    })

    var inputChart = new Chart(inputctx, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [this.model.attributes.inputCoverage.toFixed(2), (100-this.model.attributes.inputCoverage).toFixed(2)],
                    backgroundColor: [
                        'rgb(151, 204, 100)',
                        'rgb(253, 90, 62)'
                    ]
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontColor: '#000',
                fontSize: 16,
                text: 'Input Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 1
        }
    })

    var outputChart = new Chart(outputctx, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [this.model.attributes.outputCoverage.toFixed(2), (100-this.model.attributes.outputCoverage).toFixed(2)],
                    backgroundColor: [
                        'rgb(151, 204, 100)',
                        'rgb(253, 90, 62)'
                    ]
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontColor: '#000',
                fontSize: 16,
                text: 'Output Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 1
        }
    })

    dataRow2.appendChild(totalChartDiv);
    dataRow2.appendChild(inputChartDiv);
    dataRow2.appendChild(outputChartDiv);
    dataRow2.appendChild(p1);
    dataRow2.appendChild(p2);
    dataRow2.appendChild(p3);

    /////////////////////
    
    titleDiv.appendChild(titleCoverage);

    div.appendChild(titleDiv);

    div.appendChild(dataRow1);
    div.appendChild(dataRow2);

    var divs = document.querySelectorAll("[data-id='coverage']");
    var divToAdd = divs[0].children[1];
    divToAdd.appendChild(div);

    return html;
}

var MyView2 = Backbone.Marionette.View.extend({
    template: template2,

    render: function () {
        this.$el.html(this.template(this.options));
        return this;
    }
})

allure.api.addWidget('widgets', 'coverage', MyView2);
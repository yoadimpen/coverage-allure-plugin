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

/*allure.api.addWidget('widgets', 'coverage', allure.components.WidgetStatusView.extend({
    rowTag: 'a',
    title: 'coverage',
    baseUrl: 'coverage',
    showAll: true
}));*/

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

    var levelChart = new Chart(levelctx, {
        type: 'horizontalBar',
        data: {
            labels:[ "Test Coverage Level"],
            datasets: [
                {
                    data: [this.model.attributes.coverageLevel]
                }
            ]
        },
        options: {
            title: {
                display: true,
                fontColor: '#000',
                text: 'Test Coverage Level'
            },
            legend: false,
            scales:{
                xAxes: [{
                    ticks: {
                        min: 0,
                        max: 7,
                        stepSize: 1
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
    dataRow2.setAttribute("style", "margin-bottom: 5%");

    var totalChartDiv = document.createElement("div");
    totalChartDiv.setAttribute("class", "col");

    var totalChartCanvas = document.createElement("canvas");

    totalChartDiv.appendChild(totalChartCanvas);

    var totalctx = totalChartCanvas.getContext("2d");

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
                text: 'Total Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 2
        }
    })

    dataRow2.appendChild(totalChartDiv);

    /////////////////////

    var dataRow3 = document.createElement("div");
    dataRow3.setAttribute("class", "row");
    dataRow3.setAttribute("style", "margin-bottom: 5%; display: flex");

    var inputChartDiv = document.createElement("div");
    inputChartDiv.setAttribute("class", "col");
    inputChartDiv.setAttribute("style", "width: 50%");

    var outputChartDiv = document.createElement("div");
    outputChartDiv.setAttribute("class", "col");
    outputChartDiv.setAttribute("style", "width: 50%");

    var inputChartCanvas = document.createElement("canvas");
    var outputChartCanvas = document.createElement("canvas");

    inputChartDiv.appendChild(inputChartCanvas);
    outputChartDiv.appendChild(outputChartCanvas);

    var inputctx = inputChartCanvas.getContext("2d");
    var outputctx = outputChartCanvas.getContext("2d");

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
                text: 'Output Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 1
        }
    })

    dataRow3.appendChild(inputChartDiv);
    dataRow3.appendChild(outputChartDiv);

    /////////////////////
    
    titleDiv.appendChild(titleCoverage);

    div.appendChild(titleDiv);

    div.appendChild(dataRow1);
    div.appendChild(dataRow2);
    div.appendChild(dataRow3);

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
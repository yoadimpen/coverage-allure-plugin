'use strict';

var MyTabModel = Backbone.Collection.extend({
    url: 'data/coverage.json'
})

var MyTabModel2 = Backbone.Collection.extend({
    url: 'widgets/coverage.json'
})

class MyLayout extends allure.components.AppLayout {

    initialize() {
        this.model = new MyTabModel2();
    }

    loadData() {
        return this.model.fetch();
    }

    getContentView() {
        return new MyView({items: this.model.models});
    }
}

var dragSrcEl = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';
    
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
    e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }
    
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        this.classList.remove('over');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

const template = function (data) {

    var container = document.createElement("div");
    container.setAttribute("class", "myContainer");

    var div = document.createElement("div");
    div.setAttribute("draggable", "true");
    div.setAttribute("class", "box");

    /////////////////////

    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "row");
    
    var titleCoverage = document.createElement("h2");
    titleCoverage.setAttribute("class", "widget__title");
    titleCoverage.appendChild(document.createTextNode("summary"));

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
                    data: [data.items[0].attributes.coverageLevel],
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
    p1.appendChild(document.createTextNode(formatPercentage(data.items[0].attributes.totalCoverage)));

    var inputChartDiv = document.createElement("div");
    inputChartDiv.setAttribute("class", "col");
    inputChartDiv.setAttribute("style", "width: 33.3%");

    var p2 = document.createElement("p");
    p2.setAttribute("class", "graph-inner-text");
    p2.setAttribute("id", "cov-graph-2");
    p2.appendChild(document.createTextNode(formatPercentage(data.items[0].attributes.inputCoverage)));

    var outputChartDiv = document.createElement("div");
    outputChartDiv.setAttribute("class", "col");
    outputChartDiv.setAttribute("style", "width: 33.3%");

    var p3 = document.createElement("p");
    p3.setAttribute("class", "graph-inner-text");
    p3.setAttribute("id", "cov-graph-3");
    p3.appendChild(document.createTextNode(formatPercentage(data.items[0].attributes.outputCoverage)));

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
                    data: [data.items[0].attributes.totalCoverage.toFixed(2), (100-data.items[0].attributes.totalCoverage).toFixed(2)],
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
                    data: [data.items[0].attributes.inputCoverage.toFixed(2), (100-data.items[0].attributes.inputCoverage).toFixed(2)],
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
                    data: [data.items[0].attributes.outputCoverage.toFixed(2), (100-data.items[0].attributes.outputCoverage).toFixed(2)],
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
    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragenter', handleDragEnter, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('dragleave', handleDragLeave, false);
    div.addEventListener('drop', handleDrop, false);
    div.addEventListener('dragend', handleDragEnd, false);

    ////////////////////////////////////////////////////////////////////////////////////

    var divA = document.createElement("div");
    divA.setAttribute("draggable", "true");
    divA.setAttribute("class", "box");
    //divA.setAttribute("style", "height: 500px;");
    divA.appendChild(document.createTextNode("A"));
    divA.addEventListener('dragstart', handleDragStart, false);
    divA.addEventListener('dragenter', handleDragEnter, false);
    divA.addEventListener('dragover', handleDragOver, false);
    divA.addEventListener('dragleave', handleDragLeave, false);
    divA.addEventListener('drop', handleDrop, false);
    divA.addEventListener('dragend', handleDragEnd, false);

    ////////////////////////////////////////////////////////////////////////////////////

    var pathWidgetDiv = document.createElement("div");
    pathWidgetDiv.setAttribute("draggable", "true");
    pathWidgetDiv.setAttribute("class", "box");

    /////////////////////

    var pathTitleDiv = document.createElement("div");
    pathTitleDiv.setAttribute("class", "row");

    var pathTitle = document.createElement("h2");
    pathTitle.setAttribute("class", "widget__title");
    pathTitle.appendChild(document.createTextNode("path coverage"));
    
    /////////////////////

    var pathDataDiv = document.createElement("div");
    pathDataDiv.setAttribute("class", "row");

    /////////////////////

    var pathDataRow1 = document.createElement("div");
    pathDataRow1.setAttribute("class", "row");
    pathDataRow1.setAttribute("style", "margin-bottom: 5%");

    var pathChartDiv = document.createElement("div");
    pathChartDiv.setAttribute("class", "col");

    var pathCoverageCanvas = document.createElement("canvas");

    pathChartDiv.appendChild(pathCoverageCanvas);

    var pathctx = pathCoverageCanvas.getContext("2d");

    var pathChart = new Chart(pathctx, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [data.items[0].attributes.pathCoverage.toFixed(2), (100-data.items[0].attributes.pathCoverage).toFixed(2)],
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
                text: 'Path Coverage'
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 3
        }
    })

    pathDataRow1.appendChild(pathChartDiv);

    /////////////////////

    var pathDataRow2 = document.createElement("div");
    pathDataRow2.setAttribute("class", "row");

    var pathDetailsTable = document.createElement("table");
    pathDetailsTable.setAttribute("class", "table-coverage");

    var pathDetailsTableHeaderRow = document.createElement("tr");

    var pathDetailsTableHeader1 = document.createElement("th");
    pathDetailsTableHeader1.setAttribute("class", "th-coverage");
    pathDetailsTableHeader1.setAttribute("style", "width:70%;");
    pathDetailsTableHeader1.appendChild(document.createTextNode("Criterion"));
    
    var pathDetailsTableHeader2 = document.createElement("th");
    pathDetailsTableHeader2.setAttribute("class", "th-coverage");
    pathDetailsTableHeader2.appendChild(document.createTextNode("Coverage"));

    pathDetailsTableHeaderRow.appendChild(pathDetailsTableHeader1);
    pathDetailsTableHeaderRow.appendChild(pathDetailsTableHeader2);

    pathDetailsTable.appendChild(pathDetailsTableHeaderRow);

    data.items[0].attributes.coverageOfCoverageCriteria.forEach(function(detail){
        var tableRow = document.createElement("tr");
        tableRow.setAttribute("class", "tr-coverage");

        var criterion = document.createElement("td");
        criterion.setAttribute("class", "td-coverage");
        criterion.appendChild(document.createTextNode(detail.coverageCriterion));

        var cov = document.createElement("td");
        cov.setAttribute("class", "td-coverage");
        cov.appendChild(document.createTextNode(formatPercentage(detail.coverage)));

        tableRow.appendChild(criterion);
        tableRow.appendChild(cov);

        pathDetailsTable.appendChild(tableRow);
    })

    pathDataRow2.appendChild(pathDetailsTable);

    /////////////////////
    
    pathTitleDiv.appendChild(pathTitle);

    pathDataDiv.appendChild(pathDataRow1);
    pathDataDiv.appendChild(pathDataRow2);

    pathWidgetDiv.appendChild(pathTitleDiv);
    pathWidgetDiv.appendChild(pathDataDiv);

    pathWidgetDiv.addEventListener('dragstart', handleDragStart, false);
    pathWidgetDiv.addEventListener('dragenter', handleDragEnter, false);
    pathWidgetDiv.addEventListener('dragover', handleDragOver, false);
    pathWidgetDiv.addEventListener('dragleave', handleDragLeave, false);
    pathWidgetDiv.addEventListener('drop', handleDrop, false);
    pathWidgetDiv.addEventListener('dragend', handleDragEnd, false);

    ////////////////////////////////////////////////////////////////////////////////////

    var divB = document.createElement("div");
    divB.setAttribute("draggable", "true");
    divB.setAttribute("class", "box");
    divB.setAttribute("style", "height: 500px;");
    divB.appendChild(document.createTextNode("B"));
    divB.addEventListener('dragstart', handleDragStart, false);
    divB.addEventListener('dragenter', handleDragEnter, false);
    divB.addEventListener('dragover', handleDragOver, false);
    divB.addEventListener('dragleave', handleDragLeave, false);
    divB.addEventListener('drop', handleDrop, false);
    divB.addEventListener('dragend', handleDragEnd, false);

    ////////////////////////////////////////////////////////////////////////////////////

    var divC = document.createElement("div");
    divC.setAttribute("draggable", "true");
    divC.setAttribute("class", "box");
    divC.setAttribute("style", "height: 500px;");
    divC.appendChild(document.createTextNode("C"));
    divC.addEventListener('dragstart', handleDragStart, false);
    divC.addEventListener('dragenter', handleDragEnter, false);
    divC.addEventListener('dragover', handleDragOver, false);
    divC.addEventListener('dragleave', handleDragLeave, false);
    divC.addEventListener('drop', handleDrop, false);
    divC.addEventListener('dragend', handleDragEnd, false);

    ////////////////////////////////////////////////////////////////////////////////////

    var divD = document.createElement("div");
    divD.setAttribute("draggable", "true");
    divD.setAttribute("class", "box");
    divD.setAttribute("style", "height: 500px;");
    divD.appendChild(document.createTextNode("D"));
    divD.addEventListener('dragstart', handleDragStart, false);
    divD.addEventListener('dragenter', handleDragEnter, false);
    divD.addEventListener('dragover', handleDragOver, false);
    divD.addEventListener('dragleave', handleDragLeave, false);
    divD.addEventListener('drop', handleDrop, false);
    divD.addEventListener('dragend', handleDragEnd, false);

    var divbr = document.createElement("div");
    divbr.setAttribute("style", "height: 2px;");

    container.appendChild(div);

    container.appendChild(divA);

    container.appendChild(pathWidgetDiv);

    container.appendChild(divB);
    container.appendChild(divC);
    container.appendChild(divD);
    container.appendChild(divbr);

    var divs = document.getElementsByClassName("app__content");
    var divToAdd = divs[0];
    divToAdd.appendChild(container);
    
    var html = "";
    
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

/*allure.api.addWidget('coverage', 'coverage', allure.components.WidgetStatusView.extend({
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

document.addEventListener('DOMContentLoaded', (event) => {

    var dragSrcEl = null;

    function handleDragStart(e) {
        this.style.opacity = '0.4';
        
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
        e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';
        
        return false;
    }

    function handleDragEnter(e) {
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
        
        return false;
    }

    function handleDragEnd(e) {
        this.style.opacity = '1';
        
        items.forEach(function (item) {
            item.classList.remove('over');
        });
    }
    
    
    let items = document.querySelectorAll('.myContainer .box');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    });
});
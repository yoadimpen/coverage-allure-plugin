'use strict';

var MyTabModel = Backbone.Collection.extend({
    url: 'widgets/coverage.json'
})

class MyTabLayout extends allure.components.AppLayout {

    initialize() {
        this.model = new MyTabModel();
    }

    loadData() {
        return this.model.fetch();
    }

    getContentView() {
        return new MyTabView({items: this.model.models});
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
        var sourceID = dragSrcEl.id;
        var targetID = this.id;
        var sourceDiv = document.getElementById(sourceID);
        var targetDiv = document.getElementById(targetID);
        var sourceChildren = sourceDiv.children;
        var targetChildren = targetDiv.children;

        var srcChildren = sourceChildren;
        var trgChildren = targetChildren;

        var div = document.createElement("div");

        Array.prototype.slice.call(srcChildren).forEach(function(child){
            div.appendChild(child);
        });

        sourceDiv.innerHTML = "";

        Array.prototype.slice.call(trgChildren).forEach(function(child){
            sourceDiv.appendChild(child);
        });

        targetDiv.innerHTML = "";

        Array.prototype.slice.call(div.children).forEach(function(child){
            targetDiv.appendChild(child);
        });

        this.classList.remove('over');
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function getSummaryDiv(info){
    var div = document.createElement("div");
    div.setAttribute("id", "summary-widget");
    div.setAttribute("class", "grid-item");
    div.setAttribute("draggable", "true");

    var titleDiv = document.createElement("div");
    var title = document.createElement("h2");
    title.appendChild(document.createTextNode("SUMMARY"));
    titleDiv.appendChild(title);

    var dataDiv = document.createElement("div");
    dataDiv.setAttribute("class", "data-section");

    var dataRow1 = document.createElement("div");
    dataRow1.setAttribute("id", "level-part-widget");
    dataRow1.setAttribute("style", "width: 100%;");
    var levelCanvas = document.createElement("canvas");
    levelCanvas.setAttribute("id", "level-chart");
    dataRow1.appendChild(levelCanvas);

    var dataRow2 = document.createElement("div");
    dataRow2.setAttribute("id", "summary-charts");

    var levelP = document.createElement("p");
    levelP.setAttribute("id", "level-text");
    levelP.appendChild(document.createTextNode("Test Coverage Level: " + info.items[0].attributes.coverageLevel));

    var totalDiv = document.createElement("div");
    totalDiv.setAttribute("id", "summary-chart");
    var totalCanvas = document.createElement("canvas");
    totalCanvas.setAttribute("id", "total-chart");
    var totalP = document.createElement("p");
    totalP.setAttribute("id", "text-summary");
    totalP.appendChild(document.createTextNode(formatPercentage(info.items[0].attributes.totalCoverage)));
    totalDiv.appendChild(totalCanvas);
    totalDiv.appendChild(totalP);

    var inputDiv = document.createElement("div");
    inputDiv.setAttribute("id", "summary-chart");
    var inputCanvas = document.createElement("canvas");
    inputCanvas.setAttribute("id", "input-chart");
    var inputP = document.createElement("p");
    inputP.setAttribute("id", "text-summary");
    inputP.appendChild(document.createTextNode(formatPercentage(info.items[0].attributes.inputCoverage)));
    inputDiv.appendChild(inputCanvas);
    inputDiv.appendChild(inputP);

    var outputDiv = document.createElement("div");
    outputDiv.setAttribute("id", "summary-chart");
    var outputCanvas = document.createElement("canvas");
    outputCanvas.setAttribute("id", "output-chart");
    var outputP = document.createElement("p");
    outputP.setAttribute("id", "text-summary");
    outputP.appendChild(document.createTextNode(formatPercentage(info.items[0].attributes.outputCoverage)));
    outputDiv.appendChild(outputCanvas);
    outputDiv.appendChild(outputP);

    dataRow2.appendChild(levelP);
    dataRow2.appendChild(totalDiv);
    dataRow2.appendChild(inputDiv);
    dataRow2.appendChild(outputDiv);

    dataDiv.appendChild(dataRow1);
    dataDiv.appendChild(dataRow2);

    div.appendChild(titleDiv);
    div.appendChild(dataDiv);

    var levelCTX = levelCanvas.getContext("2d");

    var levelChart = new Chart(levelCTX, {
        type: 'horizontalBar',
        data: {
            labels:[ "Test Coverage Level"],
            datasets: [
                {
                    data: [info.items[0].attributes.coverageLevel],
                    backgroundColor: 'rgba(151, 204, 100, 0.5)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(151, 204, 100, 1)'
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
            aspectRatio:5.5,
            maintainAspectRatio: true
        }
    })

    var totalCTX = totalCanvas.getContext("2d");

    var totalChart = new Chart(totalCTX, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [info.items[0].attributes.totalCoverage.toFixed(2), (100-info.items[0].attributes.totalCoverage).toFixed(2)],
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
            aspectRatio: 1,
        }
    })

    var inputCTX = inputCanvas.getContext("2d");

    var inputChart = new Chart(inputCTX, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [info.items[0].attributes.inputCoverage.toFixed(2), (100-info.items[0].attributes.inputCoverage).toFixed(2)],
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
            aspectRatio: 1,
        }
    })

    var outputCTX = outputCanvas.getContext("2d");

    var outputChart = new Chart(outputCTX, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [info.items[0].attributes.outputCoverage.toFixed(2), (100-info.items[0].attributes.outputCoverage).toFixed(2)],
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
            aspectRatio: 1,
        }
    })

    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragenter', handleDragEnter, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('dragleave', handleDragLeave, false);
    div.addEventListener('drop', handleDrop, false);
    div.addEventListener('dragend', handleDragEnd, false);

    return div;
}

function getFullSummary(data){
    var div = document.createElement("div");
    div.setAttribute("id", "full-widget");
    div.setAttribute("class", "grid-item");
    div.setAttribute("draggable", "true");

    var titleDiv = document.createElement("div");
    var title = document.createElement("h2");
    title.appendChild(document.createTextNode("FULL SUMMARY"));
    titleDiv.appendChild(title);

    var dataDiv = document.createElement("div");
    dataDiv.setAttribute("class", "data-section");
    var fullDiv = document.createElement("div");
    fullDiv.setAttribute("style", "display: flex;");
    var fullCanvas = document.createElement("canvas");
    fullCanvas.setAttribute("id", "full-chart");
    fullDiv.appendChild(fullCanvas);
    dataDiv.appendChild(fullDiv);

    div.appendChild(titleDiv);
    div.appendChild(dataDiv);

    var ctx = fullCanvas.getContext("2d");

    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [{
                data: [data.items[0].attributes.totalCoverage.toFixed(2),
                    data.items[0].attributes.inputCoverage.toFixed(2),
                    data.items[0].attributes.outputCoverage.toFixed(2),
                    data.items[0].attributes.pathCoverage.toFixed(2),
                    data.items[0].attributes.operationCoverage.toFixed(2),
                    data.items[0].attributes.inputContentTypeCoverage.toFixed(2),
                    data.items[0].attributes.outputContentTypeCoverage.toFixed(2),
                    data.items[0].attributes.parameterCoverage.toFixed(2),
                    data.items[0].attributes.statusCodeClassCoverage.toFixed(2),
                    data.items[0].attributes.parameterValueCoverage.toFixed(2),
                    data.items[0].attributes.statusCodeCoverage.toFixed(2),
                    data.items[0].attributes.responseBodyPropertiesCoverage.toFixed(2)
                ],
                backgroundColor: 'rgba(151, 204, 100, 0.5)',
                borderWidth: 1.5,
                borderColor: 'rgba(151, 204, 100, 1)'
            }],
            labels: [
                'Total Coverage',
                'Input Coverage',
                'Output Coverage',
                'Path Coverage',
                'Operation Coverage',
                'Input Content Type Coverage',
                'Output Content Type Coverage',
                'Parameter Coverage',
                'Status Code Class Coverage',
                'Parameter Value Coverage',
                'Status Code Coverage',
                'Response Body Properties Coverage'
            ]
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100
                    }
                }]
            }
        }
    })

    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragenter', handleDragEnter, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('dragleave', handleDragLeave, false);
    div.addEventListener('drop', handleDrop, false);
    div.addEventListener('dragend', handleDragEnd, false);

    return div;
}

function createWidgetPlusTableDiv(info, type, name, widgetTitle, widgetH2, widgetDivID, widgetID){
    var div = document.createElement("div");
    div.setAttribute("id", widgetDivID);
    div.setAttribute("class", "grid-item");
    div.setAttribute("draggable", "true");

    var titleDiv = document.createElement("div");
    var title = document.createElement("h2");
    title.appendChild(document.createTextNode(widgetH2));
    titleDiv.appendChild(title);

    var dataDiv = document.createElement("div");
    
    var dataRow1 = document.createElement("div");
    dataRow1.setAttribute("id", "widget-chart");

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", widgetID);
    var canvasP = document.createElement("p");
    canvasP.setAttribute("id", "text-chart");
    canvasP.appendChild(document.createTextNode(formatPercentage(info.items[0].attributes[name])));

    dataRow1.appendChild(canvas);
    dataRow1.appendChild(canvasP);

    var dataRow2 = document.createElement("div");

    var headerTable = document.createElement("table");
    headerTable.setAttribute("id", "table-header");

    var trHeader = document.createElement("tr");
    var th1 = document.createElement("th");
    th1.setAttribute("style", "width: 85%; text-align: left;");
    th1.appendChild(document.createTextNode("ELEMENT"));
    var th2 = document.createElement("th");
    th2.setAttribute("style", "width: 15%;");
    th2.appendChild(document.createTextNode("COVERAGE"));

    trHeader.appendChild(th1);
    trHeader.appendChild(th2);

    headerTable.appendChild(trHeader);

    var dataTable = document.createElement("table");
    dataTable.setAttribute("id", "table-data");

    info.items[0].attributes.coverageOfCoverageCriteria.forEach(function(detail){
        if(detail.coverageCriterion.startsWith(type)){
            var row = document.createElement("tr");

            var criterion = document.createElement("td");
            var content = detail.coverageCriterion;
            content = content.replace(type, "");
            if(content == "") {content = "-";}
            criterion.appendChild(document.createTextNode(content));

            var cov = document.createElement("td");
            cov.setAttribute("style", "text-align: right;");
            cov.appendChild(document.createTextNode(formatPercentage(detail.coverage)));

            row.appendChild(criterion);
            row.appendChild(cov);

            dataTable.appendChild(row);
        }
    })

    dataRow2.appendChild(headerTable);
    dataRow2.appendChild(dataTable);

    dataDiv.appendChild(dataRow1);
    dataDiv.appendChild(dataRow2);

    div.appendChild(titleDiv);
    div.appendChild(dataDiv);

    var ctx = canvas.getContext("2d");

    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
            'Covered',
            'Not covered'
            ],
            datasets: [
                {
                    data: [info.items[0].attributes[name].toFixed(2), (100-info.items[0].attributes[name]).toFixed(2)],
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
                text: widgetTitle
            },
            legend: false,
            cutoutPercentage: 70,
            aspectRatio: 3,
        }
    })

    div.addEventListener('dragstart', handleDragStart, false);
    div.addEventListener('dragenter', handleDragEnter, false);
    div.addEventListener('dragover', handleDragOver, false);
    div.addEventListener('dragleave', handleDragLeave, false);
    div.addEventListener('drop', handleDrop, false);
    div.addEventListener('dragend', handleDragEnd, false);

    return div;
}

function existsInJSON(info, filter) {
    var res = false;

    info.items[0].attributes.coverageOfCoverageCriteria.forEach(function(detail){
        res = res || detail.coverageCriterion.startsWith(filter);
    })

    return res;
}

const templateTab = function (data) {
    
    var content = document.createElement("div");
    content.setAttribute("class", "content");

    var summaryDiv = getSummaryDiv(data);
    var fullSummaryDiv = getFullSummary(data);
    var pathDiv = existsInJSON(data, "PATH/") ? createWidgetPlusTableDiv(data, "PATH/", "pathCoverage", "Path Coverage", "PATH COVERAGE", "path-widget", "path-chart") : "non-included";
    var operationDiv = existsInJSON(data, "OPERATION/") ? createWidgetPlusTableDiv(data, "OPERATION/", "operationCoverage", "Operation Coverage", "OPERATION COVERAGE", "operation-widget", "operation-chart") : "non-included";
    var inputContentTypeDiv = existsInJSON(data, "INPUT_CONTENT_TYPE/") ? createWidgetPlusTableDiv(data, "INPUT_CONTENT_TYPE/", "inputContentTypeCoverage", "Input Content Type Coverage", "INPUT CONTENT TYPE COVERAGE", "input-content-type-widget") : "non-included";
    var outputContentTypeDiv = existsInJSON(data, "OUTPUT_CONTENT_TYPE/") ? createWidgetPlusTableDiv(data, "OUTPUT_CONTENT_TYPE/", "outputContentTypeCoverage", "Output Content Type Coverage", "OUTPUT CONTENT TYPE COVERAGE", "output-content-type-widget") : "non-included";
    var parameterDiv = existsInJSON(data, "PARAMETER/") ? createWidgetPlusTableDiv(data, "PARAMETER/", "parameterCoverage", "Parameter Coverage", "PARAMETER COVERAGE", "parameter-widget", "parameter-chart") : "non-included";
    var parameterValueDiv = existsInJSON(data, "PARAMETER_VALUE/") ? createWidgetPlusTableDiv(data, "PARAMETER_VALUE/", "parameterValueCoverage", "Parameter Value Coverage", "PARAMETER VALUE COVERAGE", "parameter-value-widget", "parameter-value-chart") : "non-included";
    var statusCodeDiv = existsInJSON(data, "STATUS_CODE/") ? createWidgetPlusTableDiv(data, "STATUS_CODE/", "statusCodeCoverage", "Status Code Coverage", "STATUS CODE COVERAGE", "status-code-widget", "status-code-chart") : "non-included";
    var statusCodeClassDiv = existsInJSON(data, "STATUS_CODE_CLASS/") ? createWidgetPlusTableDiv(data, "STATUS_CODE_CLASS/", "statusCodeClassCoverage", "Status Code Class Coverage", "STATUS CODE CLASS COVERAGE", "status-code-class-widget", "status-code-class-chart") : "non-included";
    var responseBodyPropertiesDiv = existsInJSON(data, "RESPONSE_BODY_PROPERTIES/") ? createWidgetPlusTableDiv(data, "RESPONSE_BODY_PROPERTIES/", "responseBodyPropertiesCoverage", "Response Body Properties Coverage", "RESPONSE BODY PROPERTIES COVERAGE", "response-body-properties-widget") : "non-included";

    content.appendChild(summaryDiv);
    content.appendChild(fullSummaryDiv)
    if (pathDiv != "non-included") {content.appendChild(pathDiv);}
    if (inputContentTypeDiv != "non-included") {content.appendChild(inputContentTypeDiv);}
    if (outputContentTypeDiv != "non-included") {content.appendChild(outputContentTypeDiv);}
    if (operationDiv != "non-included") {content.appendChild(operationDiv);}
    if (parameterDiv != "non-included") {content.appendChild(parameterDiv);}
    if (parameterValueDiv != "non-included") {content.appendChild(parameterValueDiv);}
    if (statusCodeDiv != "non-included") {content.appendChild(statusCodeDiv);}
    if (statusCodeClassDiv != "non-included") {content.appendChild(statusCodeClassDiv);}
    if (responseBodyPropertiesDiv != "non-included") {content.appendChild(responseBodyPropertiesDiv);}

    var divs = document.getElementsByClassName("app__content");
    var divToAdd = divs[0];
    divToAdd.appendChild(content);

    var html = "";
    return html;
}

var MyTabView = Backbone.Marionette.View.extend({
    template: templateTab,

    render: function () {
        this.$el.html(this.template(this.options));
        return this;
    }
})

allure.api.addTab('coverage', {
    title: 'Coverage', icon: 'fa fa-pie-chart',
    route: 'coverage',
    onEnter: (function () {
        return new MyTabLayout()
    })
});

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

const templateWidget = function (data) {
    var div = document.createElement("div");

    var titleDiv = document.createElement("div");
    var title = document.createElement("h2");
    title.appendChild(document.createTextNode("SUMMARY"));
    titleDiv.appendChild(title);

    var dataDiv = document.createElement("div");
    dataDiv.setAttribute("class", "data-section");

    var dataRow1 = document.createElement("div");
    dataRow1.setAttribute("id", "level-part-widget");
    dataRow1.setAttribute("style", "width: 100%;");
    var levelCanvas = document.createElement("canvas");
    levelCanvas.setAttribute("id", "level-chart");
    dataRow1.appendChild(levelCanvas);

    var dataRow2 = document.createElement("div");
    dataRow2.setAttribute("id", "summary-charts");

    var levelP = document.createElement("p");
    levelP.setAttribute("id", "level-text");
    levelP.appendChild(document.createTextNode("Test Coverage Level: " + this.model.attributes.coverageLevel));

    var totalDiv = document.createElement("div");
    totalDiv.setAttribute("id", "summary-chart");
    var totalCanvas = document.createElement("canvas");
    totalCanvas.setAttribute("id", "total-chart");
    var totalP = document.createElement("p");
    totalP.setAttribute("id", "text-summary");
    totalP.appendChild(document.createTextNode(formatPercentage(this.model.attributes.totalCoverage)));
    totalDiv.appendChild(totalCanvas);
    totalDiv.appendChild(totalP);

    var inputDiv = document.createElement("div");
    inputDiv.setAttribute("id", "summary-chart");
    var inputCanvas = document.createElement("canvas");
    inputCanvas.setAttribute("id", "input-chart");
    var inputP = document.createElement("p");
    inputP.setAttribute("id", "text-summary");
    inputP.appendChild(document.createTextNode(formatPercentage(this.model.attributes.inputCoverage)));
    inputDiv.appendChild(inputCanvas);
    inputDiv.appendChild(inputP);

    var outputDiv = document.createElement("div");
    outputDiv.setAttribute("id", "summary-chart");
    var outputCanvas = document.createElement("canvas");
    outputCanvas.setAttribute("id", "output-chart");
    var outputP = document.createElement("p");
    outputP.setAttribute("id", "text-summary");
    outputP.appendChild(document.createTextNode(formatPercentage(this.model.attributes.outputCoverage)));
    outputDiv.appendChild(outputCanvas);
    outputDiv.appendChild(outputP);

    dataRow2.appendChild(levelP);
    dataRow2.appendChild(totalDiv);
    dataRow2.appendChild(inputDiv);
    dataRow2.appendChild(outputDiv);

    dataDiv.appendChild(dataRow1);
    dataDiv.appendChild(dataRow2);

    div.appendChild(titleDiv);
    div.appendChild(dataDiv);

    var levelCTX = levelCanvas.getContext("2d");

    var levelChart = new Chart(levelCTX, {
        type: 'horizontalBar',
        data: {
            labels:[ "Test Coverage Level"],
            datasets: [
                {
                    data: [this.model.attributes.coverageLevel],
                    backgroundColor: 'rgba(151, 204, 100, 0.5)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(151, 204, 100, 1)'
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
            aspectRatio:5.5,
            maintainAspectRatio: true
        }
    })

    var totalCTX = totalCanvas.getContext("2d");

    var totalChart = new Chart(totalCTX, {
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
            aspectRatio: 1,
        }
    })

    var inputCTX = inputCanvas.getContext("2d");

    var inputChart = new Chart(inputCTX, {
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
            aspectRatio: 1,
        }
    })

    var outputCTX = outputCanvas.getContext("2d");

    var outputChart = new Chart(outputCTX, {
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
            aspectRatio: 1,
        }
    })

    var divs = document.querySelectorAll("[data-id='coverage']");
    var divToAdd = divs[0].children[1];
    divToAdd.appendChild(div);

    var html = "";

    return html;
}

var MyWidgetView = Backbone.Marionette.View.extend({
    template: templateWidget,

    render: function () {
        this.$el.html(this.template(this.options));
        return this;
    }
})

allure.api.addWidget('widgets', 'coverage', MyWidgetView);
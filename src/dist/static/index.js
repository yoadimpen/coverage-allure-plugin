'use strict';

var MyTabModel = Backbone.Collection.extend({
    url: 'data/coverage.json'
})

class MyLayout extends allure.components.AppLayout {

    initialize() {
        this.model = new MyTabModel();
    }

    loadData() {
        return this.model.fetch();
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

    //var html = "<h2 class='widget__title'>HOLA " + this.model.attributes.coverageLevel + "</h2></br>";

    var html = "";

    var initDiv = document.createElement("div");
    initDiv.setAttribute("class", "container");

    var div = document.createElement("div");
    div.setAttribute("class", "row");
    div.setAttribute("style", "display: flex");

    var textDiv = document.createElement("div");
    textDiv.setAttribute("class", "col");
    textDiv.setAttribute("style", "width: 50%;");

    var titleCoverage = document.createElement("h2");
    titleCoverage.setAttribute("class", "widget__title");
    titleCoverage.appendChild(document.createTextNode("coverage"));

    var levelCoverage = document.createElement("p");
    levelCoverage.appendChild(document.createTextNode("Test coverage level: " + this.model.attributes.coverageLevel));

    var totalCoverage = document.createElement("p");
    totalCoverage.appendChild(document.createTextNode("Total coverage (outer ring): " + this.model.attributes.totalCoverage.toFixed(2) + "%"));

    var inputCoverage = document.createElement("p");
    inputCoverage.appendChild(document.createTextNode("Input coverage (middle ring): " + this.model.attributes.inputCoverage.toFixed(2) + "%"));

    var outputCoverage = document.createElement("p");
    outputCoverage.appendChild(document.createTextNode("Output coverage (inner ring): " + this.model.attributes.outputCoverage.toFixed(2) + "%"));

    var chartDiv = document.createElement("div");
    chartDiv.setAttribute("class", "col");
    chartDiv.setAttribute("style", "width: 50%;");

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart");
    canvas.setAttribute("style", "margin-bottom: 4%; max-width: 545px; max-height: 285px;");

    chartDiv.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var chart = new Chart(ctx, {
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
                },
                {
                    data: [this.model.attributes.inputCoverage.toFixed(2), (100-this.model.attributes.inputCoverage).toFixed(2)],
                    backgroundColor: [
                        'rgb(151, 204, 100)',
                        'rgb(253, 90, 62)'
                    ]
                }, 
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
            legend: false
        }
    });

    textDiv.appendChild(titleCoverage);
    textDiv.appendChild(levelCoverage);
    textDiv.appendChild(totalCoverage);
    textDiv.appendChild(inputCoverage);
    textDiv.appendChild(outputCoverage);

    div.appendChild(textDiv);
    div.appendChild(chartDiv);

    initDiv.appendChild(div);

    var divs = document.querySelectorAll("[data-id='coverage']");
    var divToAdd = divs[0].children[1];
    divToAdd.appendChild(initDiv);

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
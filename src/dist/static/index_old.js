'use strict';

var MyTabModel = Backbone.Collection.extend({
    url: 'data/coverage.json'
})

class MyLayout extends allure.components.AppLayout {

    initialize() {
        this.model = new MyTabModel();

        /*this.model = {
          "test" : "this is a test"
        }*/
    }

    loadData() {
        return this.model.fetch();
    }

    getContentView() {
        return new MyView({items: this.model});
    }
}

const template = function (data) {
    html = '<h3 class="pane__title">My Tab</h3>';
    return html;
}

var MyView = Backbone.Marionette.View.extend({
    template: template,

    render: function () {
        this.$el.html(this.template(this.options));
        return this;
    }
})

allure.api.addTab('mytab', {
    title: 'About', icon: 'fa fa-info-circle',
    route: 'mytab',
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

allure.api.addWidget('coverage', MyWidget);
{
  let view = {
    el: '#tabs',
    init() {
      this.$el = $(this.el)
    }
  }
  let model = {

  }
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.init()
      this.bindEvents()
    },
    bindEvents() {
      this.view.$el.on('click', '.tabs-nav > li', (e) => {
        let $li = $(e.currentTarget)
        let pageName=$li.attr('data-tab-name')
        window.eventHub.emit('selectTab',pageName)
        $li.addClass('active')
          .siblings().removeClass('active')
      })
    }
  }
  controller.init(view, model)
}
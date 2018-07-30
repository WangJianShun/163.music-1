{
  let view = {
    el: '.newSong',
    template: `Song List`,
    render(data) {
      $(this.el).html(this.template)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
      this.view.render(this.model.data)
      this.active()
      window.eventHub.on('upload',(data)=>{
        
       this.active()
      })
    },
    active() {
      $(this.view.el).addClass('active')
    }
  }
  controller.init(view, model)
}
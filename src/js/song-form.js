{
  let view = {
    el: '.page>main',
    template: `
    <form class="form">
        <div class="row">
          <label>
            歌名
            <input type="text" value="__key__">
          </label>
        </div>
        <div class="row">
          <label>
            歌手
            <input type="text">
          </label>
        </div>
        <div class="row">
          <label>
            外链
            <input type="text" value="__link__">
          </label>
        </div>

        <div class="row">
          <button type="submit">保存</button>
        </div>


      </form>
      `,
    render(data={}) {
      let placeholders=['key','link']
      let html=this.template
      placeholders.map((string)=>{
        html=html.replace(`__${string}__`,data[string]||'')
      })
      $(this.el).html(html)
    }
  }
  let model = {}
  let controller = {
    init(view, model) {
      this.view =view
      this.model=model
      this.view.render(this.model.data)
      window.eventHub.on('upload',(data)=>{
        this.view.render(data)
       
      })
    },
    
  }
  controller.init(view,model)
 
}
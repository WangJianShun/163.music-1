{
  let view = {
    el: '.page>main',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <form class="form">
        <div class="row">
          <label>
            歌名
            <input name="name" type="text" value="__name__" style="width:185px;height:25px;">
          </label>
        </div>
        <div class="row">
          <label>
            歌手
            <input name="singer" type="text" value="__singer__" style="width:185px;height:25px;">
          </label>
        </div>
        <div class="row" >
          <label>
            外链
            <input name="url" type="text" value="__url__" style="width:185px;height:25px;">
          </label>
        </div>

        <div class="row">
          <button type="submit">保存</button>
        </div>
      </form>
      `,
    render(data = {}) {
      let placeholders = ['name', 'singer', 'url']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data: {
      name: '', singer: '', url: '', id: ''
    },
    create(data) {

      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name', data.name);
      // 设置优先级
      song.set('singer', data.singer);
      song.set('url', data.url);
      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        Object.assign(this.data, {
          id,
          ...attributes,//attributes有什么就会声明什么
        })
      }, (error) => {
        console.error(error);
      });
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()

      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data) => {
        this.view.render(data)
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        let needs = ['name', 'singer', 'url']
        let data = {}
        needs.map((string) => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val()
        })
        this.model.create(data)
          .then(() => {
            //console.log(this.model.data)
            this.view.reset()
            window.eventHub.emit('creat',this.model.data)
          })
      })
    }
  }
  controller.init(view, model)

}
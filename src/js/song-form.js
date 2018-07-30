{
  let view = {
    el: '.page>main',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <form class="form">
        <h1>新建歌曲</h1>
        <div class="row">
          <label>
            歌名
          </label>
          <input name="name" type="text" value="__name__" style="width:185px;height:25px;">
        </div>
        <div class="row">
          <label>
            歌手
          </label>
          <input name="singer" type="text" value="__singer__" style="width:185px;height:25px;">
        </div>
        <div class="row" >
          <label>
            外链
          </label>
          <input name="url" type="text" value="__url__" style="width:185px;height:25px;">
        </div>

          <button type="submit">保存</button>
           
      </form>
      <div class="upload">
      <div id="uploadArea">
        <div id="uploadContainer" class="daaggable">
          <div id="uploadButton" class="clickable">
            <span>拖曳或点击上传文件</span>
            <p>文件大小不能超过40mb</p>
          </div>
      </div>
      
        </div>
      </div>
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
            let string=JSON.stringify(this.model.data)
            let object = JSON.parse(string)   //深拷贝得到一个新的对象
            window.eventHub.emit('creat',object)
          })
      })
    }
  }
  controller.init(view, model)

}
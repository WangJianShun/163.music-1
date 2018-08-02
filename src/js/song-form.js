{
  let view = {
    el: '.page>main .up',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <form class="form">
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
    
      `,
    render(data = {}) {
      let placeholders = ['name', 'singer', 'url']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
      if (data.id) {
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      } else {
        $(this.el).prepend('<h1>新建歌曲</h1>')

      }
    },
    reset() {
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
    },
    update(data) {
      // 第一个参数是 className，第二个参数是 objectId
      var song = AV.Object.createWithoutData('Song', this.data.id);
      // 修改属性
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);

      // 保存到云端
      return song.save().then((response)=>{
        Object.assign(this.data,data)
        return response
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.init()

      this.view.render(this.model.data)
      this.bindEvents()

      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', (data) => {
        if (this.model.data.id) {
          this.model.data = { name: '', url: '', id: '', singer: '' }
        } else {
          Object.assign(this.model.data, data)
        }
        this.view.render(this.model.data)
      })
    },
    create() {
      let needs = ['name', 'singer', 'url']
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.create(data)
        .then(() => {
          //console.log(this.model.data)
          this.view.reset()
          let string = JSON.stringify(this.model.data)
          let object = JSON.parse(string)   //深拷贝得到一个新的对象
          window.eventHub.emit('creat', object)
        })
    },
    update() {
      let needs = ['name', 'singer', 'url']
      let data = {}
      needs.map((string) => {
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
       this.model.update(data)
       .then(()=>{
         alert('更新成功')
         window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
       })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          this.update()
        } else {
          this.create()
        }
      })
    }
  }
  controller.init(view, model)

}
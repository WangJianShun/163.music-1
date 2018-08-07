//console.log(window.location.search)
let view = {
  el: '#app',
  template: `
 <audio src="{{url}}"></audio>
 <button class="play">播放</button>
 <button class="pause">暂停</button>
 `,
 render(data){
   $(this.el).html(this.template.replace('{{url}}',data.url))
 },
 play(){
   let autio=$(this.el).find('audio')[0]
   autio.play()
 },
 pause(){
  let autio=$(this.el).find('audio')[0]
  autio.pause()
 }
}
let model = {
  data: {
    id: '',
    name: '',
    singer: '',
    url: ''
  },
  setId(id) {
    this.data.id = id
  },
  get(id) {
    var query = new AV.Query('Song')
    return query.get(id).then((song) => {
      Object.assign(this.data, { id: song.id, ...song.attributes })
      return song  // 成功获得实例
    })
  }
}
let controller = {
  init(view, model) {
    this.view = view
    this.model = model
    let id = this.getSongId()
    this.model.get(id).then(() => {
      this.view.render(this.model.data)
    })
    this.bindEvents()
  },
  bindEvents() {
    $(this.view.el).on('click','.play',()=>{
      this.view.play()
    })
    $(this.view.el).on('click','.pause',()=>{
      this.view.pause()
    })
  },
  getSongId() {
    let search = window.location.search
    if (search.indexOf('?') === 0) {
      search = search.substring(1)
    }
    let id = ''
    let array = search.split('=').filter(v => v)
    for (let i = 0; i < array.length; i++) {
      let kv = array[i]
      if (kv !== 'id') {
        id = kv
        break
      }
    }
    return id
  }
}
controller.init(view, model)

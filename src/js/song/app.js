//console.log(window.location.search)
let view = {
  el: '#app',
  render(data, status) {
    let { song } = data
    console.log(song)
    $(this.el).css('background-image', `url('${song.cover}')`)
    $(this.el).find('img.cover').attr('src', song.cover)
    
    if($(this.el).find('audio').attr('src')!==song.url){
      $(this.el).find('audio').attr('src', song.url)
    }
    if (status === 'palying') {
      $(this.el).find('.disc-container').addClass('playing')
    } else {
      $(this.el).find('.disc-container').removeClass('playing')
    }
  },
  play() {
    $(this.el).find('audio')[0].play()

  },

  pause() {
    $(this.el).find('audio')[0].pause()

  }
}
let model = {
  data: {
    song: {
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    status: 'paused'
  },

  setId(id) {
    this.data.id = id
  },
  get(id) {
    var query = new AV.Query('Song')
    return query.get(id).then((song) => {
      Object.assign(this.data.song, { id: song.id, ...song.attributes })
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
    $(this.view.el).on('click', '.icon-play', () => {
      this.model.status = 'palying'
      this.view.render(this.model.data, this.model.status)
      this.view.play()
    })
    $(this.view.el).on('click', '.icon-pause', () => {
      this.model.status = 'paused'
      this.view.render(this.model.data, this.model.status)
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

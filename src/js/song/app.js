let view = {
  el: '#app',
  init() {
    this.$el = $(this.el)
  },
  render(data) {
    let { song, status } = data
    $(this.el).css('background-image', `url('${song.cover}')`)
    $(this.el).find('img.cover').attr('src', song.cover)

    if ($(this.el).find('audio').attr('src') !== song.url) {
      let audio = $(this.el).find('audio').attr('src', song.url).get(0)
      audio.onended = () => { window.eventHub.emit('songEnd') }
      audio.ontimeupdate = () => {
        this.showlyric(audio.currentTime)
      }
    }
    if (status === 'playing') {
      $(this.el).find('.disc-container').addClass('playing')
    } else {
      $(this.el).find('.disc-container').removeClass('playing')
    }
    this.$el.find('.song-description > h1').text(song.name)
    let { lyrics } = song
    let array = lyrics.split('\n').map((string) => {
      let p = document.createElement('p')
      let regex = /\[([\d:.]+)\](.+)/
      let matches = string.match(regex)
      if (matches) {
        p.textContent = matches[2]
        let time = matches[1]
        let parts = time.split(':')
        let minutes = parts[0]
        let seconds = parts[1]
        let newTime = parseFloat(minutes, 10) * 60 + parseFloat(seconds, 10)
        p.setAttribute('data.name', newTime)
      } else {
        p.textContent = string
      }
      this.$el.find('.lyric .lines').append(p)
    })

  },
  play() {
    $(this.el).find('audio')[0].play()

  },

  pause() {
    $(this.el).find('audio')[0].pause()

  },
  showlyric(time) {
    let allP = this.$el.find('.lyric>.lines>p')
    let height
    let p
    for (let i = 0; i < allP.length; i++) {
      let currentTime = allP.eq(i).attr('data.name')
      let nextTime = allP.eq(i + 1).attr('data.name')
      if (i === allP.length - 1) {
      } else if (time >= currentTime && time < nextTime) {
        p=allP[i]
         height = allP.eq(i).offset().top - this.$el.find('.lyric >.lines').offset().top
        break
      }
    }
    
    this.$el.find('.lyric>.lines').css('transform', `translateY(${-(height-75)}px)`)
    $(p).addClass('active').siblings('.active').removeClass('active')
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
    this.view.init()
    this.bindEvents()
  },
  bindEvents() {
    $(this.view.el).on('click', '.icon-play', () => {
      this.model.data.status = 'playing'
      this.view.render(this.model.data)
      this.view.play()
    })
    $(this.view.el).on('click', '.icon-pause', () => {
      this.model.data.status = 'paused'
      this.view.render(this.model.data)
      this.view.pause()
    })
    window.eventHub.on('songEnd', () => {
      this.model.data.status = 'paused'
      this.view.render(this.view.render)
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

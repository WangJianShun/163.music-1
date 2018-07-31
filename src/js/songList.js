{
  let view = {
    el: '.songList-container',
    template: `
      <ul class="songList">
      </ul>
    `,
    render(data) {
      let $el = $(this.el)
      $el.html(this.template)
      let { songs } = data
      let liList = songs.map((song) => $('<li></li>').text(song.name))
      $el.find('ul').empty()
      var icon = `<svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-music-off"></use>
  </svg>`
      
      liList.map((domLi) => {
        $el.find('ul').append(icon,domLi)
        
      })

    },
    clearActive() {
      $(this.el).find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    },
    find(){
      var query=new AV.Query('Song')
      return query.find().then((songs)=>{
          this.data.songs=songs.map((song)=>{
            return {id:song.id,...song.attributes}
          })
          return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload', () => {
        this.view.clearActive()
      })
      window.eventHub.on('creat', (songData) => {
        console.log(songData)
        this.model.data.songs.push(songData)
        this.view.render(this.model.data)
      })
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}
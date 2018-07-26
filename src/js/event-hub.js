window.eventHub = {
  events: {},
  emit(eventName, data) {
    for (let key in this.events) {
      if (key === eventName) {
        let fnList = this.events[key]
        fnList.map((fn) => {
          fn.call(undefined, data)
        })
      }
    }
  },
  on(eventName, fn) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  },
}
/*
events: {
  //事件名
},

emit(eventsName, data) {
  for (let key in this.events) {
    if (key === eventsName) {
      let fnList = this.events[key]
      fnList.map((fn) => {
        fn.call(undefined, data)
        
      })
    }
  }
},//发布
on(eventsName, fn) {
  if (this.eventsName === undefined) {
    this.events[eventsName] = []
  }
  this.events[eventsName].push(fn)
},//订阅*/
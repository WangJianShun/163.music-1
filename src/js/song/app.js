//console.log(window.location.search)
let search=window.location.search
if(search.indexOf('?')===0){
  search=search.substring(1)
}
let id=''
let array=search.split('=').filter(v=>v)
for(let i=0;i<array.length;i++){
  let kv=array[i]
  if(kv!=='id'){
    id=kv
    break
  }
}
console.log(id)
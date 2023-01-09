// const { json } = require("express")

function publicSearch (){
    const searchDiv = document.createElement('div')
    searchDiv.id = 'searchid'
    searchDiv.innerHTML='<div class="modal fade" id="searchmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
    ' <div class="modal-dialog modal-dialog-centered" role="document">' +
       '<div class="modal-content">' +
         '<div class="modal-header"> ' +
          ' <h5 class="modal-title" id="exampleModalLongTitle">Search Bar</h5>' +
          ' <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            ' <span aria-hidden="true">&times;</span></button> </div>' +
       '  <div class="modal-body">' +
          '<div class="col-md-6">' +


          '<div class="shop__sidebar__search">' +
                        '<form action="#">'+
                           ' <input type="text" placeholder="Search..." onkeyup="sendData(this)"  style="width:210%"/>'+
                           // ' <button type="submit"><span class="icon_search" style="padding-left:80%"></span></button>'+
                       " </form>"+
                    '</div>'+
          
        ' </div>' + 
     '</div>' +
    ' <section id="searching" style="padding:10%;">'+

     '</section>'+
         '<div class="modal-footer">' +
   
         '</div></div></div></div>'

   document.body.appendChild(searchDiv)


}

function sendData(e){
   console.log(e.value);
   const searchResults = document.getElementById('searching')
   const exp = e.value.toString()
   const match = exp.match(/^[a-zA-Z ]*/)
   const match2 = exp.match(/\s*/)
   if(match2[0] === e.value){
      searchResults.innerHTML = ''
   }
   if(match[0] === e.value && e.value!=''){
      fetch('/search',{
         method:'POST',
         headers:{'content-type':'application/json'},
         body: JSON.stringify({payload:e.value})
      }).then((res)=> {return res.json() }).then(data =>{
         const suggestions = data.payload
         searchResults.innerHTML = ''

         if(suggestions.length<1){
            searchResults.innerHTML += `<p style="color:red;"> search not found </p>`
            return
         }
         suggestions.forEach((element,i) => {
            console.log(element);
            if(element.type == 'product'){
               console.log('ivde aanu product'+ element.title);
               searchResults.innerHTML += `<a href='/shopnow?q=${element.id}' onMouseOver="this.style.color='red'" nMouseOut="this.style.color='green'">${element.title}</a>` +
               `<p class='text-muted m-0> ${element.type}</p>`
            }else if(element.type == 'category'){
               console.log('ivde category');
               searchResults.innerHTML += `<a href='/shopnow?cat=${element.id}' onMouseOver="this.style.color='red'" nMouseOut="this.style.color='green'">${element.title}</a>` +
               `<p class='text -muted m-0'> ${element.type}</p>`
            }
            if(suggestions[i + 1]){
               searchResults.innerHTML += '<hr class="p-0 m-0">'
            }
         });
      })
      return 
   }
   searchResults.innerHTML = ''
}


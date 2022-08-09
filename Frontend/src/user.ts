const users= document.getElementById('user') as HTMLParagraphElement
 const names=localStorage.getItem('name')


 if(names){
   users.textContent= `Welcome User: ${names}`
 }
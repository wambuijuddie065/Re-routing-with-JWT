const admin= document.getElementById('admin') as HTMLParagraphElement
 const namess=localStorage.getItem('name')

 if(namess){
   admin.textContent=` Welcome Admin : ${namess}`
 }
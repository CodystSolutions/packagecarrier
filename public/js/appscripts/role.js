$("#addrole").submit(function(e){
    e.preventDefault()
  $.ajax({
      url: `/role/add`,
      data: $("#addrole").serialize(), 
      type: "POST", 
      dataType: 'json',
      success: function (e) {
          //alert("success")
          if(e.status == 200){
            console.log(JSON.stringify(e));
            toastr.success('Successfully added')
            setTimeout(function(){  window.location.reload();
            }, 3000);
          } else{
            toastr.error('Error, did not add')

          }
        

      },
      error:function(e){
          alert("error")

          console.log(JSON.stringify(e));


      }
  }); 
  return false;
});

$("#updaterole").submit(function(e){
  e.preventDefault()
$.ajax({
    url: `/role/update`,
    data: $("#updaterole").serialize(), 
    type: "POST", 
    dataType: 'json',
    success: function (e) {
        //alert("success")
        if(e.status == 200){
          console.log(JSON.stringify(e));
          toastr.success('Successfully updated')
          setTimeout(function(){  window.location.reload();
          }, 3000);
        } else{
          toastr.error(e.message)

        }
      

    },
    error:function(e){
        alert("error")

        console.log(JSON.stringify(e));


    }
}); 
return false;
});


function selectallroles(){
  $("#addrole input[type=checkbox]").prop('checked', true);
  $("#permissionsdiv input[type=checkbox]").prop('checked', true);

}
function deselectallroles(){
  $("#addrole input[type=checkbox]").prop('checked', false);
  $("#permissionsdiv input[type=checkbox]").prop('checked', false);

}

function confirmdelete(name, id) {
  if(confirm("Are you sure you want to delete " + name + "? \n This CANNOT be undone.")){
    $.ajax({
      url: `/role/delete/${id}`,
      data: {id: id}, 
      type: "POST", 
      dataType: 'json',
      success: function (e) {
          //alert("success")
          if(e.status == 200){
            console.log(JSON.stringify(e));
            toastr.success('Successfully deleted')
            setTimeout(function(){  window.location.reload();
            }, 3000);
          } else{
            toastr.error(e.message)
  
          }
        
  
      },
      error:function(e){
          alert("error")
  
          console.log(JSON.stringify(e));
  
  
      }
  }); 
  }
  return false
}
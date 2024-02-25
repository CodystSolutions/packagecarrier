$("#addadmin").submit(function(e){
    e.preventDefault()
  $.ajax({
      url: `/user/add`,
      data: $("#addadmin").serialize(), 
      type: "POST", 
      dataType: 'json',
      success: function (e) {
          //alert("success")
          if(e.status == 200){
            console.log(JSON.stringify(e));
            $('#exampleModal').modal('hide');
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

$("#updateadmin").submit(function(e){
  e.preventDefault()
$.ajax({
    url: `/user/update`,
    data: $("#updateadmin").serialize(), 
    type: "POST", 
    dataType: 'json',
    success: function (e) {
        //alert("success")
        if(e.status == 200){
          console.log(JSON.stringify(e));
          $('#exampleModal').modal('hide');
          toastr.success('Successfully updated')
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

function confirmdelete(name, id) {
  if(confirm("Are you sure you want to delete " + name + "? \n This CANNOT be undone.")){
    $.ajax({
      url: `/user/delete/${id}`,
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
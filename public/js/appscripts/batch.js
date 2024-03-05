$("#addbatch").submit(function(e){
  
      e.preventDefault()
    $.ajax({
        url: `/batch/create`,
        data: $("#addbatch").serialize(), 
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

  $("#updatebatch").submit(function(e){
  
    e.preventDefault()
  $.ajax({
      url: `/batch/update`,
      data: $("#updatebatch").serialize(), 
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
            toastr.error('Error, did not updated')

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
      url: `/batch/delete/${id}`,
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
$("#addrate").submit(function(e){
  console.log("rates is submitting")

    e.preventDefault()
  $.ajax({
      url: `/charge/add/rate`,
      data: $("#addrate").serialize(), 
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
            if(e.message != null && e.message != ""){
              toastr.error(e.message)
            }else{
              toastr.error('Error, did not add')
            }

          }
        

      },
      error:function(e){
          alert("error")

          console.log(JSON.stringify(e));


      }
  }); 
  return false;
});

$("#updaterate").submit(function(e){
  e.preventDefault()
$.ajax({
    url: `/charge/update/rate`,
    data: $("#updaterate").serialize(), 
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

function submitrate( num){
 

  console.log("submitting rate")
  $.ajax({
     url: `/charge/update/rate`,
     data: $(`#updaterate${num}`).serialize(), 
     type: "POST", 
     dataType: 'json',
     success: function (e) {
//         //alert("success")
         if(e.status == 200){
//           console.log(JSON.stringify(e));
           toastr.success('Successfully updated')
           setTimeout(function(){  window.location.reload();
           }, 3000);
         } else{
          if(e.message != null && e.message != ""){
            toastr.error(e.message)
          }else{
            toastr.error('Error, did not update')
          }
         

         }
      

     },
       error:function(e){
       alert("error")

        console.log(JSON.stringify(e));


     }
}); 
  return
}
$("#createAdditionalRate").submit(function(e){
  e.preventDefault()
  $.ajax({
    url: `/charge/update/increment`,
    data: $("#createAdditionalRate").serialize(), 
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

$("#createBaseRate").submit(function(e){
  e.preventDefault()
  $.ajax({
    url: `/charge/update/base`,
    data: $("#createBaseRate").serialize(), 
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


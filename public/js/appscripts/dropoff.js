function populateform(){
//  $('#sender_first_name').val('vannessa')
//  $('#sender_last_name').val('bling')
//  $('#sender_email').val('vanessage@gmail.com')
//  $('#sender_contact').val('8762947978')
//  $('#source').val('kingston')
//  $('#receiver_first_name').val('kris')
//  $('#receiver_last_name').val('long')
//  $('#receiver_email').val('krislng@gmail.com')
//  $('#receiver_contact').val('8764744688')
//  $('#destination').val('may pen')
//  $('#weight').val(3)
//  $('#category').val('electronic item')

//  $('#description').val("clothing")
//  $('#notes').val("no notes")
//  $('#paymentmethod').val("visa")

//  $('#cctype').val("visa")
//  $('#cclast4').val("7989")
//  $('#reference').val("962364758697")


}

function getrate(){
 
    var weight = document.getElementById("weight");
    var weightval = weight.value;
    console.log("submitting rate")
    $.ajax({
       url: `/dropoff/get/package/rate?weight=${weightval}`,
       type: "GET", 
       dataType: 'json',
       success: function (e) {
        console.log(e)
           if(e.status == 200 && e.response != null){
                $('#totalid').text(e.response.total);
                $('#weighttext').text(e.response.weight);
                $('#ratettext').text(e.response.rate);
                $('#chhargestext').text(e.response.charges);
                $('#subtotalttext').text(e.response.subtotal);
                $('#totalttext').text(e.response.total);
                $('#totalinput').val(e.response.total);
                return true;

           } else{
                $('#totalid').text("0.00");
                $('#weighttext').text(0);
                $('#ratettext').text(0);
                $('#chhargestext').text(0);
                $('#subtotalttext').text(0);
                $('#totalttext').text(0);
                $('#totalinput').val(0);
                return false
           }
        
  
       },
         error:function(e){
         alert("error")
  
          console.log(JSON.stringify(e));
  
  
       }
  }); 
    return false
  }

function calculatechange(){
    var change= 0;
    var tendered = document.getElementById("tendered").value;
    var total = document.getElementById("totalinput").value;
    if(total == null) total = 0 
    if(tendered == null) tendered = 0 
    if(parseFloat(tendered) >= parseFloat(total)){
        change  = tendered - total
        $('#change').val(change);
    }

    if(parseFloat(total) > parseFloat(tendered)){
        alert("Payment must be made in full");
        $('#tendered').val(0);
        $('#change').val(0);
    }
}

$("#dropoffform").submit(function(e){
    console.log("rates is submitting")
  
      e.preventDefault()
      $('#submittingtext').text("    Please wait while we save...")
  
    $.ajax({
        url: `/dropoff/create`,
        data: $("#dropoffform").serialize(), 
        type: "POST", 
        dataType: 'json',
        success: function (e) {
            if(e.status == 200){
              $('#submittingtext').text("FINISHED!")
              $('#successinfo').show()
              $('#errorinfo').hide()

              $('#trackingnumtext').text(e.details.package.tracking_number)
              $('#dropofftext').text(e.details.dropoff.code)
              $('#dropoffid').text(e.details.dropoff.id)
              // $("#receiptbtn").attr("href", "/dropoff/view/receipt/"+e.details.dropoff.id)
              // $("#labelbtn").attr("href", "/dropoff/view/label/"+e.details.dropoff.id)

              // console.log(JSON.stringify(e));
              // toastr.success('Successfully added')
              // setTimeout(function(){  window.location.reload();
              // }, 3000);
              if(e.success==false){
                toastr.error(e.message)
              }
            } else{
              $('#submittingtext').text("Error Saving!")
              $('#successinfo').hide()
              $('#errormsg').text(e.message )
              $('#errorinfo').show()
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
  


$( "#receiptbtn" ).on( "click", function() {
  var id = document.getElementById('dropoffid').innerText;
  id=parseInt(id.trim())
  generatereceipt(id)
} );
$( "#labelbtn" ).on( "click", function() {
  var id = document.getElementById('dropoffid').innerText;
  id=parseInt(id.trim())
  generatelabel(id)
} );
$( "#emailbtn" ).on( "click", function() {
  var id = document.getElementById('dropoffid').innerText;
  id=parseInt(id.trim())
  emailreceipt(id)
} );
function generatereceipt(id){
  $.ajax({
      url: `/dropoff/view/receipt/${id}`,
      type: "get", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
            var w = window.open();
          
            // console.log(JSON.stringify(e));
            // toastr.success('Successfully added')
            w.document.write(e.html);
          setTimeout(function(){      w.window.print();;
            }, 100);
        
            w.document.close();

           
            
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
}

function generatelabel(id){
  $.ajax({
      url: `/dropoff/view/label/${id}`,
      type: "get", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
            var w = window.open();
          
            // console.log(JSON.stringify(e));
            // toastr.success('Successfully added')
            w.document.write(e.html);
          setTimeout(function(){      w.window.print();;
            }, 100);
        
            w.document.close();

           
            
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
}

function openprintwindow(){
  var html = $('#htmldiv').html();
   //var w = window.open();
  //  var w = window;
  //  w.document.write(html);
  //  w.window.print();
  //  w.document.close();
  var printContents = document.getElementById(divId).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}


var   sender_suggestions =  [];
$('#sender_first_name').keyup(async function(e) {
     var value = $('#sender_first_name').val();
     
     sender_suggestions = await  getUsers("name", value);

    $( "#sender_first_name" ).autocomplete({
      source: sender_suggestions,
      select: function (event, ui) {
        var last_name = ui.item.last_name;
        var email = ui.item.email;
        var contact = ui.item.contact;

        document.getElementById("sender_last_name").value = last_name;
        document.getElementById("sender_email").value = email;
        document.getElementById("sender_contact").value = contact;

      }
    });

});



$('#sender_email').keyup(async function(e) {
     var value = $('#sender_email').val();
     
     sender_suggestions = await  getUsers("email", value);

    $( "#sender_email" ).autocomplete({
      source: sender_suggestions,
      select: function (event, ui) {
        var last_name = ui.item.last_name;
        var first_name = ui.item.first_name;
        var contact = ui.item.contact;

        document.getElementById("sender_last_name").value = last_name;
        document.getElementById("sender_first_name").value = first_name;
        document.getElementById("sender_contact").value = contact;

      }
    });

});




var   receiver_suggestions =  [];
$('#receiver_first_name').keyup(async function(e) {
     var value = $('#receiver_first_name').val();
     
     receiver_suggestions = await  getUsers("name", value);

    $( "#receiver_first_name" ).autocomplete({
      source:  receiver_suggestions,
      select: function (event, ui) {
        var last_name = ui.item.last_name;
        var email = ui.item.email;
        var contact = ui.item.contact;

        document.getElementById("receiver_last_name").value = last_name;
        document.getElementById("receiver_email").value = email;
        document.getElementById("receiver_contact").value = contact;

      }
    });

});




$('#receiver_email').keyup(async function(e) {
     var value = $('#receiver_email').val();
     
     receiver_suggestions = await  getUsers("email", value);

    $( "#receiver_email" ).autocomplete({
      source: receiver_suggestions,
      select: function (event, ui) {
        var last_name = ui.item.last_name;
        var first_name = ui.item.first_name;
        var contact = ui.item.contact;

        document.getElementById("receiver_last_name").value = last_name;
        document.getElementById("receiver_first_name").value = first_name;
        document.getElementById("receiver_contact").value = contact;

      }
    });

});




async function getUsers(type, value){
  var list = []
  $.ajax({
    url: `/user/search/${type}/${value}`,
    type: 'GET',
    dataType: 'json', // added data type,
    async: false,
    success: function(res) {
        if(res.status == 200){
          for(var i = 0; i < res.users.length;i++ ){
              var anonymousmsg ="";
              if(res.users[i].is_anonymous) anonymousmsg = "*Anonymous user*"
              
              var listinfo = {label:  res.users[i].first_name + " " + res.users[i].last_name  + " " + res.users[i].email + " " + anonymousmsg,last_name: res.users[i].last_name,first_name: res.users[i].first_name, email:  res.users[i].email ,contact:  res.users[i].contact , value: res.users[i].first_name }
              if(type=="name") listinfo.value = res.users[i].first_name
              if(type=="email") listinfo.value = res.users[i].email

              list.push(listinfo)
          }
        }
    }

});
return list;

}

$('#paymentmethod').on('change', function() {
  if(this.value == "card"){
    $('.ccinfo').show()
  } else{
    $('.ccinfo').hide()
  }
});



$('input[name="method"]').on('change', function() {
  console.log("thsval", this.value )
  if(this.value == "prepaid"){
    $('.paymentinfo').show()
    $('#tendered').attr('required', true)
    $('#paymentmethod').attr('required', true)

  } else{
    $('#tendered').attr('required', false)
    $('#paymentmethod').attr('required', false)

    $('.paymentinfo').hide()
  }
});



$("#updateform").submit(function(e){
  e.preventDefault()
  var dropoffid = document.getElementById("dropoffid").value;

  $.ajax({
      url: `/dropoff/update/${dropoffid}`,
      data: $("#updateform").serialize(), 
      type: "POST", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
            
            console.log(JSON.stringify(e));
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
  return false;
});

function deletedropoff(id){
  var confirmed = confirm("Are you sure you want to delete this drop off request. By removing dropoff requests you are removing the packages belonging to this request!");
  if(confirmed){
    $.ajax({
      url: `/dropoff/delete/${id}`,
      type: "post", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
           
               console.log(JSON.stringify(e));
                toastr.success('Successfully deleted')
                setTimeout(function(){  window.location = '/dropoff/view'
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
  }

}



function emailreceipt(id){
  if(id){
    $.ajax({
      url: `/dropoff/email/receipt/${id}`,
      type: "post", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
           
               console.log(JSON.stringify(e));
                toastr.success('Successfully emailed')
                setTimeout(function(){  window.location.reload()
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
  }

}

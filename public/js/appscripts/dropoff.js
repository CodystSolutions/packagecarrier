function populateform(){
    console.log("populating")
 $('#sender_first_name').val('jodi')
 $('#sender_last_name').val('taylor')
 $('#sender_email').val('jtanjels2324@gmail.com')
 $('#sender_contact').val('8768728878')
 $('#source').val('kingston')
 $('#receiver_first_name').val('john')
 $('#receiver_last_name').val('brown')
 $('#receiver_email').val('brown22424@gmail.com')
 $('#receiver_contact').val('8764328358')
 $('#destination').val('montego bay')
 $('#weight').val(3)
 $('#description').val("clothing")
 $('#notes').val("no notes")
 $('#paymentmethod').val("visa")

 $('#cctype').val("visa")
 $('#cclast4').val("7989")
 $('#reference').val("962364758697")


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
    $.ajax({
        url: `/dropoff/create`,
        data: $("#dropoffform").serialize(), 
        type: "POST", 
        dataType: 'json',
        success: function (e) {
            if(e.status == 200){
              $('#submittingtext').text("FINISHED!")
              $('#successinfo').show()
              $('#trackingnumtext').text(e.details.package.tracking_number)
              $("#receiptbtn").attr("href", "/print/receipt/"+e.details.dropoff.id)
              $("#labelbtn").attr("href", "/print/label/"+e.details.dropoff.id)

              // console.log(JSON.stringify(e));
              // toastr.success('Successfully added')
              // setTimeout(function(){  window.location.reload();
              // }, 3000);
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
            w.window.print();
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
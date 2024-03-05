var count = 0 
var alreadyscanned =[]
$("#scanpackageform").submit(function(e){
    console.log("package is scanning")
    
      e.preventDefault()
    $.ajax({
        url: `/pickup/checkout/scan`,
        data: $("#scanpackageform").serialize(), 
        type: "POST", 
        dataType: 'json',
        success: function (e) {
            if(e.status == 200){
                //add package to the page
                count ++ 
                document.getElementById("count").innerText = count;

                let scanlist = document.getElementById("scanlist");
                // scanlist.innerHTML =''
                let trname = document.createElement('tr');
                //spanname.innerHTML =  ' <th scope="row">1</th>  </br><b>"+   (uncheckedpackages[i].user?.first_name || "No user") + " " +  (uncheckedpackages[i].user?.last_name || "") + " #" +  uncheckedpackages[i].user?.mailbox_number  + "</b> -   <span style='color:red'>" + uncheckedpackages.filter(x => x.user?.mailbox_number == uncheckedpackages[i].user?.mailbox_number).length + " packages </span>" + `<a style="text-decoration: underline; color: #007bff"  onclick="verifyall('<%= manifest.id%>','${ uncheckedpackages[i].user?.id}')">Verify All </a>` + '</br> ' ;
                trname.innerHTML = `<th scope="row">${e.package.tracking_number}</th>
                <td>${e.package.sender_first_name} ${e.package.sender_last_name}</td>
                <td>${e.package.receiver_first_name} ${e.package.receiver_last_name} </td>
                <td>${e.package.destination}</td>
                <td>${e.package.status}</td>
                <td>${e.package.batch?.name}</td>
                <td>  <input type="checkbox" id="tracking_nums" name="tracking_nums" value="${e.package.tracking_number}" checked /></td>

                `
                scanlist.prepend(trname);
             } 
             
             else{
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
async function scanpackages(){
    var tracking_number = document.getElementById("tracking_number").value;
    console.log("package is scanning", tracking_number)
        $.ajax({
        url: `/pickup/checkout/scan`,
        data: {tracking_number: tracking_number}, 
        type: "POST", 
        dataType: 'json',
        success: function (e) {
            if(e.status == 200){
                //add package to the page
             

                if(!alreadyscanned.includes(e.package.tracking_number)){
                  if(e.package.status != "ready for pickup"){
                    alert(`Package ${e.package.tracking_number} is not ready for pickup. Current status is  ${e.package.status}.`)
                  } else{
                    count ++ 
                    document.getElementById("count").innerText = count;
                    let scanlist = document.getElementById("scanlist");
                    // scanlist.innerHTML =''
                    let trname = document.createElement('tr');
                    //spanname.innerHTML =  ' <th scope="row">1</th>  </br><b>"+   (uncheckedpackages[i].user?.first_name || "No user") + " " +  (uncheckedpackages[i].user?.last_name || "") + " #" +  uncheckedpackages[i].user?.mailbox_number  + "</b> -   <span style='color:red'>" + uncheckedpackages.filter(x => x.user?.mailbox_number == uncheckedpackages[i].user?.mailbox_number).length + " packages </span>" + `<a style="text-decoration: underline; color: #007bff"  onclick="verifyall('<%= manifest.id%>','${ uncheckedpackages[i].user?.id}')">Verify All </a>` + '</br> ' ;
                    trname.innerHTML = `<th scope="row">${e.package.tracking_number} - ${e.package.weight}lbs , ${e.package.description}</th>
                    <td>${e.package.sender_first_name} ${e.package.sender_last_name}</td> 
                    <td>${e.package.receiver_first_name} ${e.package.receiver_last_name} </td>
                    <td>${e.package.destination}</td>
                    <td>${e.package.method}</td>
                    <td>${e.package.status}</td>
                    <td>${e.package.batch?.name}</td>
                    <td>  <input type="checkbox" id="tracking_nums" name="tracking_nums" value="${e.package.tracking_number}" checked /></td>
    
                    `
                    scanlist.prepend(trname);
                  }
               
                }
               
                alreadyscanned.push(e.package.tracking_number);

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
  };


  function gettotal(){
    var tracking_nums = []
    const checkboxes = document.getElementsByName('tracking_nums');
    checkboxes.forEach(el => el.checked &&  tracking_nums.push(el.value))

    console.log("submitting tracking numbers", tracking_nums)
    $.ajax({
       url: `/pickup/get/package/total?tracking_numbers=${tracking_nums}`,
       type: "GET", 
       dataType: 'json',
       success: function (e) {
        console.log(e)
           if(e.status == 200 && e.response != null){

                $('#totalid').text(e.response.total);
                $('#chhargestext').text(e.response.charges);
                $('#subtotalttext').text(e.response.subtotal);
                $('#totalttext').text(e.response.total);
                $('#totalinput').val(e.response.total);
                if(e.response.total == 0){
                  $("#bank-detail input").attr("required", false);

                  $('.cardinfo').hide()
                  $('input[name=method][value=prepaid]').prop("checked", true);
                  $('input[name=method][value="prepaid"]').prop("disabled", false);

                  $('input[name=method][value="pay on collect"]').prop("disabled", true);
                  $('input[name=method][value="pay on collect"]').prop("checked", false);


                } else{
                  if(e.response.total > 0) {
                    $("#bank-detail input").attr("required", true);

                  }
                  $('.cardinfo').show()
                  $('input[name=method][value=prepaid]').prop("checked", false);
                  $('input[name=method][value=prepaid]').prop("disabled", true);
                  $('input[name=method][value="pay on collect"]').prop("checked", true);
                  $('input[name=method][value="pay on collect"]').prop("disabled", false);


                }
                return true;

           } else{
                $("#bank-detail input").attr("required", false);
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

   
$("#pickupcheckoutform").submit(function(e){
    console.log("rates is submitting")
  
      e.preventDefault()
    $.ajax({
        url: `/pickup/create`,
        data: $("#pickupcheckoutform").serialize(), 
        type: "POST", 
        dataType: 'json',
        success: function (e) {
            if(e.status == 200){
              $('#submittingtext').text("FINISHED!")
              $('#successinfo').show()
              $('#errorinfo').hide()

              $('#collectiontext').text(e.details.collection_request.code)
              $('#collectionid').text(e.details.collection_request.id)
              // console.log(JSON.stringify(e));
              // toastr.success('Successfully added')
              // setTimeout(function(){  window.location.reload();
              // }, 3000);
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
  

function generatereceipt(id){
    $.ajax({
        url: `/pickup/view/receipt/${id}`,
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

  $('#paymentmethod').on('change', function() {
    if(this.value == "card"){
      $('.ccinfo').show()
      $('#cctype').attr('required', true)
      $('#cclast4').attr('required', true)
    } else{
      $('.ccinfo').hide()
      $('#cctype').attr('required', false)
      $('#cclast4').attr('required', false)
    }
  });
  
$('input[name="method"]').on('change', function() {
  if(this.value == "pay on collect"){
    $('#tendered').attr('required', true)
    $('#paymentmethod').attr('required', true)

    $('#reference').attr('required', true)

  } else{
    console.log("this value 2", this.value)

    $('#tendered').attr('required', false)
    $('#paymentmethod').attr('required', false)

   
    $('#reference').attr('required', false)
  }
});



$( "#receiptbtn" ).on( "click", function() {
  var id = document.getElementById('collectionid').innerText;
  id=parseInt(id.trim())
  generatereceipt(id)
} );
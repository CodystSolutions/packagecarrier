function calculatechange(){
    var change= 0;
    var tendered = document.getElementById("tendered").value;
    var total = document.getElementById("total").value;
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



$("#updateform").submit(function(e){
    e.preventDefault()
    var transactionid = document.getElementById("transactionid").value;
  
    $.ajax({
        url: `/transaction/update/${transactionid}`,
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
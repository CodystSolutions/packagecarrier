var count = 0 
$("#scanpackageform").submit(function(e){
    console.log("package is scanning")
    
      e.preventDefault()
    $.ajax({
        url: `/package/scan`,
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

                `
                scanlist.prepend(trname);
                
                document.getElementById('trackingresult').innerText = e.package.tracking_number;
                document.getElementById('senderresult').innerText =e.package.sender_first_name + " " + e.package.sender_last_name;
                document.getElementById('receiverresult').innerText = e.package.receiver_first_name + " " + e.package.receiver_last_name;
                document.getElementById('batchresult').innerText = e.package.batch?.name;

                document.getElementById('destinationresult').innerText = e.package.destination;

                 $('#scanresult').modal('show');
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

  $( "#labelbtn" ).on( "click", function() {
    var id = document.getElementById('dropoffid').innerText;
    id=parseInt(id.trim())
    generatelabel(id)
  } );

  function generatelabel(id){
    $.ajax({
        url: `/package/view/label/${id}`,
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



$("#updateform").submit(function(e){
  e.preventDefault()
  var packageid = document.getElementById("packageid").value;

  $.ajax({
      url: `/package/update/${packageid}`,
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

function deletepackage(id){
  var confirmed = confirm("Are you sure you want to delete this package. ");
  if(confirmed){
    $.ajax({
      url: `/package/delete/${id}`,
      type: "post", 
      dataType: 'json',
      success: function (e) {
          if(e.status == 200){
           
               console.log(JSON.stringify(e));
                toastr.success('Successfully deleted')
                setTimeout(function(){  window.location = '/package/view'
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
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
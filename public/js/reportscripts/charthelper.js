
$("#branchfilter").submit(async function(e){
    e.preventDefault()

    var value = document.getElementById('name').value;
    await getstats('sourcebranch',`${value}`)
    console.log("filtered branch")
});


$("#branchfilter2").submit(async function(e){
    e.preventDefault()

    var value = document.getElementById('destinationbranch').value;
    await getstats('destinationbranch',`${value}`)
    console.log("filtered destinationbranch")
});
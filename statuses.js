var dropoffstatuses = {
    pending: "pending transit",
    pendingcollection: "pending collection",
    intransit: "in transit",
    cancelled: "cancelled",
    completed: "completed"
}
var packagesstatuses = {
    pending: "pending transit",
    cancelled: "cancelled",
    completed: "completed",
    loaded: "loaded in truck",
    intransit: "in transit",
    receivedatdestination: "received at destination",
    readyforpickup: "ready for pickup"
    
}


var collectionsstatuses = {
    collected: "collected",
    cancelled: "cancelled",
}

module.exports.dropoffstatuses = dropoffstatuses;
module.exports.packagesstatuses = packagesstatuses;
module.exports.collectionsstatuses = collectionsstatuses;

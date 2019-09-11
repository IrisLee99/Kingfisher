
function DateFormatter(unix_timestamp) {
    var date = new Date(unix_timestamp*1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '(hh:mm:ss)';

    //console.log("time: " + formattedTime);      //hh:mm:ss
    return formattedTime;
}

exports.DateFormatter = DateFormatter;
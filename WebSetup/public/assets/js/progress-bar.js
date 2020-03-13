var fileReader=function(){ 
    jQuery.get({url:'state.json',cache: false}, function(data) {

        if(data.percentage != 100){
            $("#finish-setup").hide();
            $(".progress-bar-percentage").html("<strong>"+data.percentage+" %</strong>");
            $("#progress-bar-state-p").text(data.state);
            $("#progress-bar-main").css("width",data.percentage+"%");

            $('#installStep').empty();

            var stepsDone = data.done;
            stepsDone.map((key)=>{$("#installStep" ).append('<div class="row"><h5>'+key+'</h5><i class="material-icons icon-progress-step bb">check_circle_outline</i></div>');})
            $("#progress-bar-state" ).html('<h4 id="progress-bar-state-p"><strong>'+data.stage+'...</strong></h4>');

            
        }else{
            $(".progress-bar-percentage").html("<strong>"+data.percentage+" %</strong>");
            $("#progress-bar-state-p").text(data.state);
            $("#progress-bar-main").css("width",data.percentage+"%");

            $('#installStep').empty();

            var stepsDone = data.done;
            stepsDone.map((key)=>{$("#installStep" ).append('<div class="row"><h5>'+key+'</h5><i class="material-icons icon-progress-step bb">check_circle_outline</i></div>');})
            $("#progress-bar-state" ).html('<h4 id="progress-bar-state-p"><strong>'+data.stage+'...</strong></h4>');


            /*setTimeout(function(){ 
                $("#finish-setup").show();
            },1000)   */
            $("#finish-setup").show();
            $("#progressInformations").hide();

            
            
        }
    });
};

$(document).ready(function() { 
    fileReader();
    setInterval(fileReader, 1000);
})

$(document).ready(function(){

    function uuid() {
        var temp_url = URL.createObjectURL(new Blob());
        var uuid = temp_url.toString();
        URL.revokeObjectURL(temp_url);
        return uuid.substr(uuid.lastIndexOf('/') + 1); 
      }
    $('#Add').click(function(){
        let apikey=uuid();
        let idrow=apikey;
       
        let rowtb=`<tr id="${apikey}">
        <td>
            <span class="custom-checkbox">
            <input type="checkbox" name="options[]" value="${apikey}">
            <label for="checkbox1"></label>
            </span>
        </td>
        <td class="param d-flex flex-row"><span>/</span><input name="param" type="url"></td>
        <td class="name"><input name="name" type="text"></td>
        <td class="urliframe"><input type="url" name="url"></td>
        <td>
            <a href="javascript:function() { return false; }" class="save" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Edit">save
            </i></a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Delete"></i></a>
        </td>
    </tr>
    <tr> <td></td><th colspan="7"> <span class="cnote">Note: </span> <input class="note" type="text"></th> </tr>
    `;
     $("tbody").prepend(rowtb);
     $("#"+idrow+" .name input").css('border','double');
     $("#"+idrow).next().find('.note').css('border','double');
     $("#"+idrow+" .param input").css('border','double');
     $("#"+idrow+" .urliframe input").css('border','double');
     $("#"+idrow+" .param input").focus(); 
    });
    $('#addFilterr').click(function(){
        let id=$("#ab").data("id");
        let name=$("input[name='namef']").val();
        let namebt=$(this).val();
        let dt={
            "name":name
        };
        if(namebt=="Add"){
            $.ajax({
                method: "POST",
                url: "/insert",
                data:dt
            }).done(function( msg ) {
                let rowtb=`<tr id="${msg.id}">
                    <td>
                        <span class="custom-checkbox">
                        <input type="checkbox" name="options[]" value="${msg.id}">
                        <label for="checkbox1"></label>
                        </span>
                    </td>
                    <td>${msg.id}</td>
                    <td class="name"><a href="/filter/${msg.id}"> ${name}</a></td>
                    <td>
                        <a href="#" class="editt" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Edit">&#xe3c9</i></a>
                        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`;
                 $("tbody").append(rowtb);
                $('#addfilter').modal('hide');
            });
        }else{
            $.ajax({
                method: "PUT",
                url: "/update/"+id,
                data:dt
            }).done(function( msg ) {
                $("#"+id+" .name").text(name);
                $('#addfilter').modal('hide');
            });
        }
        
    });
    $('#tbfilter').on('click', '.update', function() {
        $(this).removeClass("update").addClass("editt");
        $(this).find("i").text("edit")
        let idrow=$(this).closest('tr').attr('id');
        $("#"+idrow).next().find('.note').attr('readonly',true);
        $("#"+idrow).next().find('.note').css('border','none');
        $("#"+idrow+" .param input").attr("readonly", true); 
        $("#"+idrow+" .param input").css('border','none');
        $("#"+idrow+" .urliframe input").css('border','none');
        $("#"+idrow+" .urliframe input").attr("readonly", true); 
        $("#"+idrow+" .name input").attr("readonly", true); 
        $("#"+idrow+" .name input").css('border','none');
        let username=$(".username").text();
        let name=$("#"+idrow+" .name input").val();
        let param=$("#"+idrow+" .param input").val();
        let urliframe=$("#"+idrow+" .urliframe input").val();
        let note=$("#"+idrow).next().find('.note').val();
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
          });
        var myDate = Date.parse(nDate);
        let dt={
            "name":name,
            "param":param,
            "urliframe":urliframe,
            "updateat":myDate,
            "modifyby":username,
            "note":note
        };
        $.ajax({
            method: "put",
            url: "/api/update/"+idrow,
            data:dt
            }).done(function( msg ) {
                if(msg.status=="duplicate"){
                    $("#"+msg.ifold.id+" .name input").val(msg.ifold.name);
                    $("#"+msg.ifold.id+" .param input").val(msg.ifold.param);
                    $("#"+msg.ifold.id+" .urliframe input").val(msg.ifold.urliframe);
                    $("#"+msg.ifold.id).next().find('.note').val(msg.ifold.note);
                    alert("Duplicate parameters!")
                }
            });

    });
    $('#tbfilter').on('click', '.save', function() {
        $(this).find("i").text("edit")
        $(this).removeClass("save").addClass("editt");
        let idrow=$(this).closest('tr').attr('id');
        $("#"+idrow).next().find('.note').attr('readonly',true);
        $("#"+idrow).next().find('.note').css('border','none');
        $("#"+idrow+" .param input").attr("readonly", true); 
        $("#"+idrow+" .param input").css('border','none');
        $("#"+idrow+" .name input").css('border','none');
        $("#"+idrow+" .name input").attr("readonly", true); 
        $("#"+idrow+" .urliframe input").attr("readonly", true); 
        $("#"+idrow+" .urliframe input").css('border','none');
        let name=$("#"+idrow+" .name input").val();
       let param=$("#"+idrow+" .param input").val();
        let urliframe=$("#"+idrow+" .urliframe input").val();
        let username=$(".username").text();
        let note=$("#"+idrow).next().find('.note').val();
        let todaysDate =new Date(); 
        const nDate = todaysDate.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
          });
        var myDate = Date.parse(nDate);
        let dt={
            "id":idrow,
            "name":name,
            "param":param,
            "urliframe":urliframe,
            "createdat":myDate,
            "createby":username,
            "note":note
        };
        $.ajax({
            method: "post",
            url: "/api/insert",
            data:dt
            }).done(function( msg ) {
                if(msg.status=="duplicate"){
                    $('#tbfilter tr#'+msg.id).next().remove();
                    $('#tbfilter tr#'+msg.id).remove();
                    alert("Duplicate parameters!")
                }
                // $('#deleteEmployeeModal').modal('hide');
            });
    });
    $('#tbfilter').on('click', '.editt', function() {
       $(this).find("i").text("save")
        $(this).removeClass("editt").addClass("update");
        let idrow=$(this).closest('tr').attr('id');
        $("#"+idrow).next().find('.note').attr('readonly',false);
        $("#"+idrow).next().find('.note').css('border','double');
        $("#"+idrow+" .name input").css('border','double');
        $("#"+idrow+" .name input").attr("readonly", false); 
        $("#"+idrow+" .urliframe input").css('border','double');
        $("#"+idrow+" .urliframe input").attr("readonly", false); 
        $("#"+idrow+" .param input").css('border','double');
        $("#"+idrow+" .param input").attr("readonly", false); 
        $("#"+idrow+" .param input").focus(); 
    });
	$('#tbfilter').on('click', '.delete', function() {
		$('.remove').attr("data-id","only");
		var ID =$(this).closest('tr').attr('id');
		$("#ab").data("id",ID)
	
    });
    $('#DeleteAll').click(function(){
		$('.remove').attr("data-id","all");
    });
    $('.remove').click(function(){
        var chkb = $("input[name='options[]']:checked").map(function(){return $(this).val();}).get();
        if($('.remove').attr("data-id")=="all"){
			if(chkb.length>0){
				for(l in chkb){
                    $('#tbfilter tr#'+chkb[l]).next().remove();
					$('#tbfilter tr#'+chkb[l]).remove();
					$.ajax({
					method: "DELETE",
					url: "/api/delete/"+chkb[l],
					}).done(function( msg ) {
						$('#deleteEmployeeModal').modal('hide');
					});
				}
			}else{
				alert("You have not selected any item!")
			}
		}else{
            $('#tbfilter tr#'+$("#ab").data("id")).next().remove();
            $('#tbfilter tr#'+$("#ab").data("id")).remove();
			$.ajax({
				method: "DELETE",
				url: "api/delete/"+$("#ab").data("id"),
				}).done(function( msg ) {
					$('#deleteEmployeeModal').modal('hide');
				});
		}
    })
    $('[data-toggle="tooltip"]').tooltip();
    var checkbox = $('table tbody input[type="checkbox"]');
	$("#selectAll").click(function(){
		$('input:checkbox').not(this).prop('checked', this.checked);
	});
	
	checkbox.click(function(){
		if(!this.checked){
			$("#selectAll").prop("checked", false);
		}
	});
});
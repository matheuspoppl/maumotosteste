
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseFloat( $('#ivlmin').val().replace(",",".") );
        var max = parseFloat( $('#ivlmax').val().replace(",",".") );
        var age = parseFloat( data[targetCols].replace(",",".") ) || 0; // use data for the age column
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && age <= max ) ||
             ( min <= age   && isNaN( max ) ) ||
             ( min <= age   && age <= max ) )
        {
            return true;
        }
        return false;
    }
);

function filterColumn ( i, proc ) {
    if(i != ''){
       $('#tabelaestoque').DataTable().column( i ).search( proc, false, true ).draw();
    }
}

function filterGlobal ( proc ) {
       $('#tabelaestoque').DataTable().search( proc, false, true ).draw();
}

function limparFiltros(){ 
    
    $('#ifiltro1').val("");
    $('#ifiltro1').change();
    $('#icampo1').val("");
    
    $('#ivlmax').val("");
    $('#ivlmin').val("");
    $('#ivalores').val("");
    $('#ivalores').change();
    $('#ipesqglobal').val("");
    $('#ipesqglobal').change();

}

function validaDat(valor){
	var date=valor;
	var ardt=new Array;
	var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
	ardt=date.split("/");
	erro=false;
	if ( date.search(ExpReg)==-1){
		erro = true;
		}
	else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
		erro = true;
	else if ( ardt[1]==2) {
		if ((ardt[0]>28)&&((ardt[2]%4)!=0))
			erro = true;
		if ((ardt[0]>29)&&((ardt[2]%4)==0))
			erro = true;
	}
	if (erro) {
		return false;
	}
	return true;
}

function limparInputsAdd(){
    for(var i=12; i >= 1; i--){
        $("#itxt"+i).val("");
    }
}

function confirmaAdicao(){

    for (var i = 1; i <= 11; i++){
        switch (i) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 8:
            case 9:
                if($('#itxt'+i+'').val() == "" && $('#itxt'+i+'').attr('required') == "required" ){ 
                    alert("Preencha o campo: "+$('#itxt'+i+'').attr('placeholder'));
                    return;
                }
            case 6:
            case 7: //usado para os selects
                if( $('#itxt'+i+'').val() == null ){
                    alert("Preencha o campo: "+$('#itxt'+i+' :selected').html());
                    return;
                }
                break;    
        }      
    }
    

    if(confirm("Deseja adicionar o Item?")){
        var infos = new Array();

        infos[0] = $('#itxt1').val();
        infos[1] = $('#itxt2').val();
        infos[2] = $('#itxt3').val();
        infos[3] = parseFloat($('#itxt4').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[4] = parseFloat($('#itxt5').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[5] = $('#itxt6 :selected').html();
        infos[6] = $('#itxt7').val();
        infos[7] = parseFloat($('#itxt8').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[8] = parseFloat($('#itxt9').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
        infos[9] = $('#itxt10').val();
        infos[10] = $('#itxt11').val();
        infos[11] = $('#itxt12').val();

        var action = "adicionarItem";
        if(infos != ''){
            $.ajax({
                url:baselink+"/ajax/"+action,
                type: "POST",
                data:{info:infos}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
                dataType:"json",  //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success:function(json){
                    
                    console.log(parseInt(json.id));
                    console.log(json.alter);
                    if(parseInt(json.id) > 0){ // deu certo e remove a linha quitada
                        // inserir o produto na tabela
                        var t = $('#tabelaestoque').DataTable();
                        t.row.add( [
                            '<input type="hidden" value='+json.alter+'/>'+
                            '<input type="checkbox" onchange="selecionaLinha(this)"/>'+
                            '<div data-ident='+json.id+' class="botao_peq_st" onclick="editar(this)">Editar</div>',
                            $('#itxt1').val(),
                            $('#itxt2').val(),
                            $('#itxt3').val(),
                            $('#itxt4').val(),
                            $('#itxt5').val(),
                            $('#itxt6 :selected').html(),
                            $('#itxt7 :selected').html(),
                            $('#itxt8').val(),
                            $('#itxt9').val(),
                            $('#itxt10').val(),
                            $('#itxt11').val(),
                            $('#itxt12').val(),
                        ] ).draw( true );

                        alert("Operação realizada com sucesso!");
                        $('#iadicao').dialog("close");
                        return;
                    }else{//deu errado - vai de novo
                        alert("A adição não foi realizada, faça novamente.");
                        return;
                    }
                },                
                error:function(){
                    // avisar que não foi feita a quitação
                    alert("A adição não foi realizada, por favor, faça novamente.");
                    return;
                }
            });
        }

    }
}

window.onload = function(){
//    $("#iselecitens").hide();
//    $("#ifiltros").hide();
//    $('#iedititens').hide();
};

$(document).ready(function () {
    $("#ititulo1").click(function(){
        $("#ifiltros").slideToggle();
    });
//    $("#ititulo2").click(function(){
//        $("#iadicao").slideToggle();
//    });
    
    // filtro global de texto
    $('#ipesqglobal').on('keyup change' ,function(){
        filterGlobal( $('#ipesqglobal').val() );
    });
    
    $('#ivlmin, #ivlmax').change( function() {
        if($('#ivalores').val() != ""){
            targetCols = $('#ivalores').val();
            table.draw();
        }else{
            $('#ivlmin').val("");
            $('#ivlmax').val("");
            table.draw();
            alert("Escolha o campo de Valor a ser filtrado.")
        }
    } );
    
    $('#ivalores').change(function(){
        if($('#ivalores').val() != ""){
            $('#ivlmin, #ivlmax').change(); 
        }else{
            $('#ivlmin').val("");
            $('#ivlmax').val("");
            table.draw();
        }
    }); 
    
    //filtros de texto
    $('#ifiltro1').on('keyup change' ,function(){
        if($('#icampo1 :selected').val() == ""){
            $('#ifiltro1').val("");
        }else{
            filterColumn( $('#icampo1 :selected').val(), $('#ifiltro1').val() );
        }    
    });
    
    $('#icampo1').on('focus',function(){             
        if($('#ifiltro1').val() != ""){
          $('#ifiltro1').val("");  
          $('#ifiltro1').change();  
        }
    });
        
    //configuração da tabela
    var table = $('#tabelaestoque').DataTable( 
        {   
            columnDefs: [
                { orderable: false, targets: [0] },
            ],
            scrollY: '100vh',
            scrollCollapse: true,
            "scrollX": true,
            
            responsive:true,
            
            "language": {
                "decimal": ",",
                "thousands": ".",
                "sEmptyTable": "Nenhum registro encontrado",
                "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                "sInfoPostFix": "",
                "sInfoThousands": ".",
                "sLengthMenu": "_MENU_ Resultados por página",
                "sLoadingRecords": "Carregando...",
                "sProcessing": "Processando...",
                "sZeroRecords": "Nenhum registro encontrado",
                "sSearch": "Pesquisar",
                "oPaginate": {
                    "sNext": "Próximo",
                    "sPrevious": "Anterior",
                    "sFirst": "Primeiro",
                    "sLast": "Último"
                },
                "oAria": {
                    "sSortAscending": ": Ordenar colunas de forma ascendente",
                    "sSortDescending": ": Ordenar colunas de forma descendente"
                }
            },
        
            "lengthMenu": [[10, 20], [10, 20]],
            
            "dom": '<l><t><ip>',
        }
    );
    
    table.on( 'draw', function () {
//        console.log("redraw acionado");
//        $('#iselectodos').prop('checked',false);
//        $('#tabelalancamentos tbody input[type=checkbox]').prop('checked',false);
//        $('#tabelalancamentos tbody tr.selected').removeClass('selected');
//        calculaSelecao();
    } );
    
    $("#iadicao").dialog({
        autoOpen: false,
        show: {
          effect: "blind",
          duration: 1000
        },
        hide: {
          effect: "explode",
          duration: 1000
        },  
        resizable: true,
        height: "auto",
        modal: true
    });
        
    $( "#ititulo2" ).on( "click", function() {
        limparInputsAdd();
        var larg = parseInt(window.innerWidth * 0.95);
        $('#iadicao').dialog("option", "width", larg);
        $("#iadicao").dialog( "open" );
    });
    window.onresize = function(){
        var larg = parseInt(window.innerWidth * 0.95);
        $('#iadicao').dialog("option", "width", larg);
    };
    
    $('#itxt1').autocomplete({
      source: fornecedores
    });
    
    $('#itxt1').blur(function(){
        if( $("#itxt1").val() != ''){
            if($.inArray($("#itxt1").val(), fornecedores) ==  -1 ){
                alert("Fornecedor não encontrado.");
                $("#itxt1").val("");
                $("#itxt2").val("");
                $("#itxt3").val("");
            }else{
                var nome = $(this).val();
                var action = "buscaProdutosFornecedor";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{q:nome},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               //preenche o autocomplete do produto
                               $( "#itxt3" ).autocomplete({
                                    source: json
                                });
                            }
                        }
                    });
                }
            }    
        }
    });
    
    $('#itxt2').on('blur',function(){
        if( $("#itxt1").val() != ""){
            if($("#itxt2").val() != "" ){ 
                var cod = $(this).val();
                var forn = $("#itxt1").val();
                var action = "ConfereCodProd";
                if($(this).val() != ''){
                    $.ajax({
                        url:baselink+"/ajax/"+action,
                        type: 'POST',
                        data:{codigo:cod, fornecedor:forn},
                        dataType:'json',
                        success:function(json){
                            if(json.length > 0){
                               $('#itxt2').val("");
                               alert("O Código do Produto já existe. Tente outro.");
                            }
                        }
                    });
                }
            }
        }else if($("#itxt2").val() != ""){
           alert("Preencha o Fornecedor."); 
        }    
    });
    
    $('#itxt4').mask("#.##0,00", {reverse: true});
    $('#itxt4').on('blur',function(){
        if($("#itxt4").val() != ""){            
            if($("#itxt4").val() <= 0){
               alert("O valor deve ser maior do que zero.");
               $("#itxt4").val("");
            }
        }    
    });
    
    $('#itxt5').mask("#.##0,00", {reverse: true});
    $('#itxt5').on('blur',function(){
        if($("#itxt5").val() != ""){            
            if($("#itxt4").val() != ""){  
                var custo = parseFloat($('#itxt4').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
                var venda = parseFloat($('#itxt5').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2);
                console.log("custo: "+custo);
                console.log("venda: "+venda);
                if(custo > venda){
                   alert("O valor deve ser maior do que o valor de custo.");
                   $("#itxt5").val("");
                }
            }else{
                alert("Preencha o valor de custo.");
                $("#itxt5").val("");
            }    
        }    
    });
    
    $('#itxt8').mask("#.##0,00", {reverse: true});
    $('#itxt8').on('blur',function(){
        if($("#itxt8").val() != ""){            
            if($("#itxt8").val() <= 0){
               alert("O valor deve ser maior do que zero.");
               $("#itxt8").val("");
            }
        }    
    });
    
    $('#itxt9').mask("#.##0,00", {reverse: true});
    $('#itxt9').on('blur',function(){
        if($("#itxt9").val() != ""){            
            if($("#itxt9").val() < 0){
               alert("O valor deve ser maior do que zero.");
               $("#itxt9").val("");
            }
        }    
    });
    
    $('#itxt11').mask("00000000", {reverse: true});
    
});


function selecionaLinha(obj){
//    if($(obj).is(':checked')){
//        $(obj).closest('tr').addClass('selected');
//    }else{
//        $(obj).closest('tr').removeClass('selected');
//    }
//    calculaSelecao();
}

function selecionaTodos(obj){
//    if($(obj).is(':checked')){
//        $('#tabelalancamentos tbody input[type=checkbox]').prop('checked',true);
//        $('#tabelalancamentos tbody tr').addClass('selected');
//    }else{
//        $('#tabelalancamentos tbody input[type=checkbox]').prop('checked',false);  
//        $('#tabelalancamentos tbody tr.selected').removeClass('selected');
//    }
//    calculaSelecao();
}

function calculaSelecao(){
//    console.log("calcula seleçao acionado");
//    var totlinhas = $('#tabelalancamentos tbody tr').length;
//    var totselec = $('#tabelalancamentos tbody tr.selected').length;
//    var desptotal = 0;
//    var rectotal = 0;
//    for(var i = 0; i < totlinhas; i++){
//        if(typeof $('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(12)').html() != 'undefined'){
//            if($('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(4)').html() == 'Receita'){
//                rectotal = rectotal + parseFloat($('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(12)').html().replace(',','.'));
//            }else{
//                desptotal = desptotal + parseFloat($('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(12)').html().replace(',','.'));
//            }
//        }
//    }
//
//    if(totselec > 0){
//
//        $("#iitens").html(totselec + " Item(ns) Selecionado(s)");
//        $("#idesps").html("DESPESA TOTAL: "+desptotal.toFixed(2).replace(".",","));
//        $("#irecs").html("RECEITA TOTAL: "+rectotal.toFixed(2).replace(".",","));
//        $('#idtquitacao').val("");
//        
//        if(totselec > 1){
//            $('#idtquitacao').val("");
//            $("#iselecitens").slideDown('slow');
//            $("#iedititens").hide();
//        }else{
//            if($("#iedititens").is( ":hidden" )){
//                $("#iselecitens").slideDown('slow');
//            }else{
//                $('#idtquitacao').val("");
//                $("#iselecitens").hide();
//            }
//        }    
//    }else{
//        $('#idtquitacao').val("");
//        $("#iselecitens").hide();
//        $("#iedititens").hide();
//    }
    
}

function quitar(){
//    if($("#idtquitacao").val() == ''){
//        alert("Preencha a data de quitação dos itens");
//        return;
//    }
//    if($('#tabelalancamentos tbody tr.selected').length <= 0){
//        alert("Selecione pelo menos um item na tabela.");
//        return;
//    }
//    if($("#idtquitacao").val() != '' && $('#tabelalancamentos tbody tr.selected').length > 0){
//        if(confirm("Tem Certeza que deseja quitar esses itens?") == true){
//            var totlinhas = $('#tabelalancamentos tbody tr').length;
//            var id = new Array();
//            var valortotal = new Array();
//            var alteracoes = new Array();
//            var j = 0;
//            for(var i = 0; i < totlinhas; i++){
//                if(typeof $('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(12)').html() != 'undefined'){
//                    id[j] = $('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(0)').children('div').attr('data-ident');
//                    alteracoes[j] = $('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(0)').children('input').val();
//                    valortotal[j] = parseFloat($('#tabelalancamentos tbody tr.selected:eq('+i+') td:eq(12)').html().replace(',','.'));
//                    j++;
//                }
//            }
//
//            var dataquitacao = $('#idtquitacao').val();
//            var action = "quitarItens";
//            
//            if(id != '' && valortotal != '' && alteracoes != '' && dataquitacao != ''){
//                $.ajax({
//                    url:baselink+"/ajax/"+action,
//                    type: "POST",
//                    data:{ids:id,valtot:valortotal,alters:alteracoes,dtquit:dataquitacao}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
//                    dataType:"json",                    //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
//                    success:function(json){
//                        if(json > 0){ // deu certo e remove a linha quitada
//                            alert("Operação realizada com sucesso!");
//                            window.location.href = baselink+"/controlecaixa";
//                            return;
//                        }else{//deu errado - vai de novo
//                            alert("A quitação não foi realizada, faça novamente.");
//                            return;
//                        }
//                    },
//                    error:function(){
//                        // avisar que não foi feita a quitação
//                        alert("A quitação não foi realizada, por favor, faça novamente.");
//                        return;
//                    }
//                });
//            }
//
//        }
//    }
}

function limparInputsAux(){
    
//    $('#icondpgto').val("");
//    $('#icondpgto').attr('data-ant',"");
//    $('#iformapgto').val("");
//    $('#iformapgto').attr('data-ant',"");
//    $('#icc').val("");
//    $('#icc').attr('data-ant',"");
//    $('#ianal').val("");
//    $('#ianal').attr('data-ant',"");
//    $('#isint').val("");
//    $('#isint').attr('data-ant',"");
//    $('#iobservaux').val("");
//    $('#iobservaux').attr('data-ant',"");
//    $('#ifav').val("");
//    $('#ifav').attr('data-ant',"");
//    $('#idesc').val("");
//    $('#idesc').attr('data-ant',"");
//    $('#ivpago').val("");
//    $('#ivpago').attr('data-ant',"");
//    $('#vtot').val("");
//    $('#vtot').attr('data-ant',"");
//    $('#idtvenc').val("");
//    $('#idtvenc').attr('data-ant',"");
//    $('#inroparc').val("");
//    $('#inroparc').attr('data-ant',"");
//    $('#idtop').val("");
//    $('#idtop').attr('data-ant',"");
//    $('#inropedido').val("");
//    $('#inropedido').attr('data-ant',"");
//    $('#imov').val("");
//    $('#imov').attr('data-ident','');
//    $('#imov').attr('data-alter','');
    
}

function cancelaEdicao(){
//    limparInputsAux();
//    $('#iedititens').hide('slow');
//    $('#tabelalancamentos').DataTable().draw();
}

function editar(obj){
//    console.log("btn editar acionado");
//    $('#iselectodos').prop('checked',false);
//    $('#iselectodos').change();
//       
//    limparInputsAux();
//    
//    var idlinha = $(obj).closest('tr').children('td:eq(0)').children('div:eq(0)').attr('data-ident');
//    var alter = $(obj).closest('tr').children('td:eq(0)').children('input:eq(0)').val();
//    
//    var nropedido  = $(obj).closest('tr').children('td:eq(1)').html(); 
//    var mov        = $(obj).closest('tr').children('td:eq(4)').html();
//    var sintetica  = $(obj).closest('tr').children('td:eq(5)').html();
//    var analitica  = $(obj).closest('tr').children('td:eq(6)').html();
//    var detalhe    = $(obj).closest('tr').children('td:eq(7)').html();
//    var ccorrente  = $(obj).closest('tr').children('td:eq(8)').html();
//    var favorecido = $(obj).closest('tr').children('td:eq(10)').html();
//    var dtop       = $(obj).closest('tr').children('td:eq(11)').html(); 
//    var valtot     = $(obj).closest('tr').children('td:eq(12)').html(); 
//    var formapgto  = $(obj).closest('tr').children('td:eq(13)').html();
//    var condpgto   = $(obj).closest('tr').children('td:eq(14)').html();
//    var nroparc    = $(obj).closest('tr').children('td:eq(15)').html();
//    var dtvenc     = $(obj).closest('tr').children('td:eq(16)').html(); 
//    var valpago    = $(obj).closest('tr').children('td:eq(17)').html();
//    var obs        = $(obj).closest('tr').children('td:eq(20)').html();
//    
//    $('#isint').attr('data-ant',sintetica);
//    $('#ianal').attr('data-ant',analitica);
//    
//    $('#imov').val(mov);
//    $('#imov').attr('data-ident',idlinha);
//    $('#imov').attr('data-alter',alter);
//    
//    $('#inroparc').val(nroparc);
//    $('#inroparc').attr('data-ant',nroparc);
//    $('#inropedido').val(nropedido);
//    $('#inropedido').attr('data-ant',nropedido);
//    $('#idtop').val(dtop);
//    $('#idtop').attr('data-ant',dtop);
//    $('#idtvenc').val(dtvenc);
//    $('#idtvenc').attr('data-ant',dtvenc);
//    $('#ivtot').val(valtot);
//    $('#ivtot').attr('data-ant',valtot);
//    $('#ivpago').val(valpago);
//    $('#ivpago').attr('data-ant',valpago);
//    $('#idesc').val(detalhe);
//    $('#idesc').attr('data-ant',detalhe);
//    $('#ifav').val(favorecido);
//    $('#ifav').attr('data-ant',favorecido);
//    $('#iobservaux').val(obs);
//    $('#iobservaux').attr('data-ant',obs);
//    
//    var action ='';
//        action = "buscaSinteticas";
//    if(mov != ''){
//        $.ajax({
//            url:baselink+"/ajax/"+action,
//            type: "POST",
//            data:{q:mov},   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
//            dataType:"json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
//            success:function(json){
//                //limpei o select e coloquei a primeira opção (placeholder) 
//                $('#isint').empty();
//                //adiciona os options respectivos
//                $('#isint').append('<option value="" selected disabled>Conta Sintética</option>');
//                if(json.length > 0){                     
//                    //insere as contas sinteticas especificas
//                    for(var i=0; i < json.length; i++){
//                        $('#isint').append('<option value='+json[i].id+'>'+json[i].nome+'</option>');
//                        
//                        if(json[i].nome === sintetica){
//                            var selec =  json[i].id;
//                        }
//                    }
//                    $('#isint').val(selec);
//                    var id = selec;
//                    action = "buscaAnaliticas";
//                    if(id != ''){
//                        $.ajax({
//                            url:baselink+"/ajax/"+action,
//                            type: "POST",
//                            data:{q:id},   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
//                            dataType:"json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
//                            success:function(json){
//                                //limpei o select e coloquei a primeira opção (placeholder) 
//                                $('#ianal').empty();
//                                //adiciona os options respectivos
//                                $('#ianal').append('<option value="" selected disabled>Conta Analítica</option>');
//                                if(json.length > 0){                     
//                                   //insere as contas sinteticas especificas
//                                   for(var i=0; i < json.length; i++){
//                                        $('#ianal').append('<option value='+json[i].id+'>'+json[i].nome+'</option>');
//                                        if(json[i].nome === analitica){
//                                            var selec1 =  json[i].id;
//                                        }
//                                    }
//                                    $('#ianal').val(selec1);
//                                }
//                            }
//                        });
//                    }
//                    
//                }
//            }
//        });
//    }
//
//    $('#icc').attr('data-ant',ccorrente);
//    if($('#icc option').length > 1){
//       for(var i = 1; i <= $('#icc option').length; i++ ){
//           if($('#icc option:eq('+i+')').html() == ccorrente){
//               var val = $('#icc option:eq('+i+')').val();
//           }
//       } 
//       $('#icc').val(val);
//    }
//    
//    $('#iformapgto').attr('data-ant',formapgto);
//    if($('#iformapgto option').length > 1){
//       for(var i = 1; i <= $('#iformapgto option').length; i++ ){
//           if($('#iformapgto option:eq('+i+')').html() == formapgto){
//               var val = $('#iformapgto option:eq('+i+')').val();
//           }
//       } 
//       $('#iformapgto').val(val);
//    }
//       
//    $('#iformapgto').change();
//    
//    $('#icondpgto').attr('data-ant',condpgto);
//    if($('#icondpgto option').length > 1){
//       for(var i = 1; i <= $('#icondpgto option').length; i++ ){
//           if($('#icondpgto option:eq('+i+')').html() == condpgto){
//               var val = $('#icondpgto option:eq('+i+')').val();
//           }
//       } 
//       $('#icondpgto').val(val);
//    }
//    
//    $(obj).closest('tr').children('td').children('input[type=checkbox]').prop('checked',true);
//    $(obj).closest('tr').addClass('selected');
//    $("#iselecitens").hide();
//    $('#iedititens').show();
}

function confirmaEdicao(){
//    if($('#imov').attr('data-ident') == '' || $('#imov').attr('data-alter') == ''){
//        alert("Algum problema ocorreu, clique no botão editar do item novamente");
//        return;
//    }else if( $('#imov').val() == '' || $('#inropedido').val() == '' || $('#idtop').val() == '' || $('#inroparc').val() == '' || $('#idtvenc').val() == ''){
//        alert("Todos os campos são de preenchimento obrigatório, exceto a observação.");
//        return;
//    }else if( $('#ivtot').val() == '' || $('#ivpago').val() == '' || $('#idesc').val() == '' || $('#ifav').val() == '' || $('#isint').val() == null ){
//        alert("Todos os campos são de preenchimento obrigatório, exceto a observação.");
//        return;
//    }else if( $('#ianal').val() == null || $('#icc').val() == null || $('#iformapgto').val() == null || $('#icondpgto').val() == null){
//        alert("Todos os campos são de preenchimento obrigatório, exceto a observação.");
//        return;
//    }else{ 
//    
//        var alters = '';
//        if($('#isint :selected').html() != $('#isint').attr('data-ant') ){
//           alters = '[sintetica - de (' + $('#isint').attr('data-ant') + ') para (' + $('#isint :selected').html() + ')]';  
//        }
//        if($('#ianal :selected').html() != $('#ianal').attr('data-ant') ){
//           alters = alters + '[analitica - de (' + $('#ianal').attr('data-ant') + ') para (' + $('#ianal :selected').html() + ')]';  
//        } 
//        if($('#idesc').val().toUpperCase().trim() != $('#idesc').attr('data-ant').toUpperCase().trim() ){
//           alters = alters + '[detalhe - de (' + $('#idesc').attr('data-ant') + ') para (' + $('#idesc').val().trim() + ')]';  
//        } 
//        if($('#icc :selected').html() != $('#icc').attr('data-ant') ){
//           alters = alters + '[c.corrente - de (' + $('#icc').attr('data-ant') + ') para (' + $('#icc :selected').html() + ')]';  
//        }
//        if($('#ifav').val().toUpperCase().trim() != $('#ifav').attr('data-ant').toUpperCase().trim() ){
//           alters = alters + '[favorecido - de (' + $('#ifav').attr('data-ant') + ') para (' + $('#ifav').val().trim() + ')]';  
//        }
//        if($('#ivtot').val() != $('#ivtot').attr('data-ant') ){
//           alters = alters + '[valor total - de (' + $('#ivtot').attr('data-ant') + ') para (' + $('#ivtot').val() + ')]';  
//        }
//        if($('#iformapgto :selected').html() != $('#iformapgto').attr('data-ant') ){
//           alters = alters + '[forma pgto - de (' + $('#iformapgto').attr('data-ant') + ') para (' + $('#iformapgto :selected').html() + ')]';  
//        }
//        if($('#icondpgto :selected').html() != $('#icondpgto').attr('data-ant') ){
//           alters = alters + '[cond. pgto - de (' + $('#icondpgto').attr('data-ant') + ') para (' + $('#icondpgto :selected').html() + ')]';  
//        }
//        if($('#idtvenc').val() != $('#idtvenc').attr('data-ant') ){
//           alters = alters + '[dt vencimento - de (' + $('#idtvenc').attr('data-ant') + ') para (' + $('#idtvenc').val() + ')]';  
//        }
//        if($('#ivpago').val() != $('#ivpago').attr('data-ant') ){
//           alters = alters + '[valor pago - de (' + $('#ivpago').attr('data-ant') + ') para (' + $('#ivpago').val() + ')]';  
//        }
//        if($('#iobservaux').val().toUpperCase().trim() != $('#iobservaux').attr('data-ant').toUpperCase().trim() ){
//           alters = alters + '[observação - de (' + $('#iobservaux').attr('data-ant') + ') para (' + $('#iobservaux').val().trim() + ')]';  
//        }
//        if(alters != ""){
//            if(confirm("Deseja editar o Item?")){
//                var infos = new Array();
//                
//                infos[0] = $('#imov').attr('data-ident'); // id 
//                infos[1] = $('#isint :selected').html(); //sintetica
//                infos[2] = $('#ianal :selected').html(); //analitica
//                infos[3] = $('#idesc').val().trim(); //detalhe
//                infos[4] = $('#icc :selected').html();   //conta corrente
//                infos[5] = $('#ifav').val().trim();  //favorecido
//                infos[6] = parseFloat($('#ivtot').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //val total
//                infos[7] = $('#iformapgto :selected').html(); //forma pgto
//                infos[8] = $('#icondpgto :selected').html();  //cond pgto
//                var dtaux = $('#idtvenc').val().split("/");
//                    dtaux = dtaux[2]+"-"+dtaux[1]+"-"+dtaux[0];
//                infos[9] =  dtaux;  //dt vencimento
//                infos[10] = parseFloat($('#ivpago').val().replace(".","").replace(".","").replace(".","").replace(".","").replace(",",".")).toFixed(2); //valor pago 
//                infos[11] = $('#iobservaux').val().trim(); //observ
//                infos[12] = $('#imov').attr('data-alter'); // alterações antigas do item
//                infos[13] = alters; //alterações atuais do item
//                
//                var action = "editarItem";
//                if(infos != ''){
//                    $.ajax({
//                        url:baselink+"/ajax/"+action,
//                        type: "POST",
//                        data:{info:infos}, //acentos e caracteres diferentes causam erro, precisam ser utf8 antes de receber
//                        dataType:"json",                    //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
//                        success:function(json){
//                            if(json > 0){ // deu certo e remove a linha quitada
//                                alert("Operação realizada com sucesso!");
//                                //window.location.href = baselink+"/controlecaixa";
//                                location.reload();
//                                return;
//                            }else{//deu errado - vai de novo
//                                alert("A edição não foi realizada, faça novamente.");
//                                return;
//                            }
//                        },
//                        error:function(){
//                            // avisar que não foi feita a quitação
//                            alert("A edição não foi realizada, por favor, faça novamente.");
//                            return;
//                        }
//                    });
//                }
//                
//            }
//        }else{
//            alert("Não foram feitas edições. Tente Novamente.");
//            return;
//        }
//    }
}
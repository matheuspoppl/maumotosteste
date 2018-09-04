<link href="<?php echo BASE_URL;?>/assets/css/estoque.css" rel="stylesheet" type="text/css"/>
<script src="<?php echo BASE_URL;?>/assets/js/estoque.js" type="text/javascript"></script>
<script type="text/javascript">var baselink = '<?php echo BASE_URL;?>'; var targetCols = 8;
     var fornecedores = new Array();
    <?php foreach ($listaFornecedores as $fr):?>
        fornecedores.push(<?php echo json_encode(ucwords($fr["nomefantasia"]))?>);
    <?php endforeach;?>
</script>
<style>
    .ui-autocomplete {
      max-height: 200px;
      overflow-y: auto;
      /* prevent horizontal scrollbar */
      overflow-x: hidden;
    }
    /* IE 6 doesn't support max-height
     * we use height instead, but this forces the menu to always be this tall
     */
    * html .ui-autocomplete {
      height: 200px;
    }
    
    label, input { display:block; }
    input.text { margin-bottom:12px; width:95%; padding: .4em; }
    fieldset { padding:0; border:0; margin-top:25px; }
    h1 { font-size: 1.2em; margin: .6em 0; }
    div#users-contain { min-width: 320px; width:90%; margin: 20px 0; }
    div#users-contain table { margin: 1em 0; border-collapse: collapse; width: 100%; }
    div#users-contain table td, div#users-contain table th { border: 1px solid #eee; padding: .6em 10px; text-align: left; }
    .ui-dialog .ui-state-error { padding: .3em; }
    .validateTips { border: 1px solid transparent; padding: 0.3em; }
 </style>

<h1 class="titulo_st">CONTROLE ESTOQUE</h1>


<div class="input-pai"><div class="input-filho">
        <div id="ititulo1"> Filtros </div>
        <div id="ifiltros">
            <div class="input-pai">
                <div class="input-filho">            
                    <input type="text" id="ipesqglobal" class="input-block" placeholder="Pesquisar em TODAS as Colunas por:"/>
                </div>
                <div class="input-filho">            
                    <div  class="botao_stAux" onclick="limparFiltros()"> Limpar Filtros</div>
                </div>
            </div>
            
            <div class="input-pai">
                <div class="input-filho">
                    <select class="select-block" id="ivalores">
                        <option value="">Filtrar Valores Coluna:</option>
                        <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                            <?php if($listaColunas[$i]["tipo"] == "float"):?>
                                <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                            <?php endif;?>    
                    <?php endfor;?>
                    </select>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ivlmin" class="input-block" placeholder="Valor Inicial"/>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ivlmax" class="input-block" placeholder="Valor Final"/>
                </div>
            </div>    

            <div class="input-pai">
                <div class="input-filho">
                    <select class="select-block" id="icampo1">
                        <option value="">Procurar pela Coluna:</option>
                        <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                            <?php if($listaColunas[$i]["tipo"] != "float" ):?>
                                <option value="<?php echo ($i-1);?>"><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></option>
                            <?php endif;?>
                        <?php endfor;?>
                    </select>
                </div>
                <div class="input-filho">            
                    <input type="text" id="ifiltro1" class="input-block" placeholder="Procurar Por:" />
                </div>
            </div>
        </div>    
</div></div>        

<!--<div class="input-pai" id="iselecitens"><div class="input-filho">
        <div id="ititulo2"> Resumo da Seleção</div>
        <div id="iresumo">
        <div class="input-pai">
            <div class="input-filho"> <p id="iitens"></p></div>
            <div class="input-filho"> <p id="idesps"></p></div>
            <div class="input-filho"> <p id="irecs"></p></div>
        </div>

        <div class="input-pai">
            <div class="input-filho">
                <input type="text" id="idtquitacao" class="input-block" placeholder="Data de Quitação" />
            </div>
            <div class="input-filho">
                <div class="botao_lc" onclick="quitar()">Quitar Selecionados</div>
            </div>
        </div>    
    </div>   
</div></div>   -->

<!--<div class="input-pai" id="iedititens"><div class="input-filho">
        <div id="ititulo2"> Editar Informações do Item </div>
        <div id="iedicao">
            <div class="input-pai">
                <div class="input-filho">
                    <label for="imov"><b>Tipo Movimentação:</b> 
                        <input type="text" name="mov" id="imov" data-ident = '' data-alter = '' class="input-block" readonly="readonly" style="background-color: #CCC; min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="inropedido"><b>Número do Pedido:</b> 
                        <input type="text" name="nropedido" id="inropedido" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC; min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="idtop"><b>Data da Operação:</b> 
                        <input type="text" name="dtop" id="idtop" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC;min-width: 180px"/>
                    </label>
                </div>
                <div class="input-filho">
                    <label for="inroparc"><b>Nro Parcela:</b> 
                        <input type="text" name="nroparc" id="inroparc" data-ant="" class="input-block" readonly="readonly" style="background-color: #CCC;min-width: 180px"/>
                    </label>
                </div>
            </div>
            
            <div class="input-pai">
                <div class="input-filho">
                    <label for="idtvenc"><b>Data de Vencimento:</b> 
                        <input type="text" name="dtvenc" id="idtvenc" data-ant="" class="input-block" />
                    </label>
                </div>
                <div class="input-filho">           
                    <label for="ivtot"><b>Valor Total:</b> <input type="text" name="vtot" id="ivtot" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">           
                    <label for="ivpago"><b>Valor Pago:</b> <input type="text" name="vpago" id="ivpago" data-ant="" class="input-block"/></label>
                </div>
            </div>
            <div class="input-pai">    
                <div class="input-filho">           
                    <label for="idesc"><b>Detalhe:</b> <input type="text" name="desc" id="idesc" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">           
                    <label for="ifav"><b>Favorecido:</b> <input type="text" name="fav" id="ifav" data-ant="" class="input-block"/></label>
                </div>
                <div class="input-filho">
                    <label for="iobservaux"><b>Observação:</b> <input type="text" name="observaux" id="iobservaux" data-ant="" class="input-block"/></label>
                </div>
            </div>

            <div class="input-pai">
                <div class="input-filho">           
                    <label for="isint"><b>Conta Sintética:</b>
                        <select id="isint" name="sint"  data-ant="" class="select-block">
                            <option value="" selected >Conta Sintética</option>
                        </select>
                    </label>
                </div>
                <div class="input-filho">           
                    <label for="ianal"><b>Conta Analítica:</b>
                        <select id="ianal" name="anal"  data-ant="" class="select-block">
                            <option value="" selected >Conta Analítica</option>
                        </select>
                    </label>
                </div>
                <div class="input-filho"> 
                    <label for="icc"><b>Conta Corrente:</b>
                        <select id="icc" name="cc" data-ant="" class="select-block">
                            <option value="" selected disabled>Conta Corrente</option>
                                </?php foreach ($listaContasCorrentes as $cc):?>
                                    <option value="</?php echo $cc["id"]?>" ></?php echo ucwords($cc["nome"]);?></option>
                                </?php endforeach;?>
                        </select>
                    </label>
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <label for="iformapgto"><b>Forma de Pagamento:</b>
                        <select id="iformapgto" name="formapgto"  data-ant="" class="select-block">
                            <option value="" selected disabled>Forma de Pagamento</option>
                            </?php foreach ($listaFormasPgto as $fp):?>
                            <option value="</?php echo $fp["id"]?>" ></?php echo utf8_encode(ucwords($fp["nome"]));?></option>
                            </?php endforeach;?>
                        </select>
                    </label>
                </div>
                <div class="input-filho"> 
                    <label for="icondpgto"><b>Condição de Pagamento:</b>
                        <select id="icondpgto" name="condpgto"  data-ant="" class="select-block">
                            <option value="" selected disabled>Condição de Pagamento</option>
                        </select>
                    </label>
                </div>  
            </div>
            <div class="input-pai">
                <div class="input-filho">
                    <div class="botao_lcAux" onclick="confirmaEdicao()"> Editar </div>
                </div>
                <div class="input-filho">
                    <div class="botao_lcAux" onclick="cancelaEdicao()"> Cancelar </div>
                </div>
            </div>
        </div>   
</div></div>   -->

<div class="input-pai"><div class="input-filho">
        <div id="ititulo2"> Adicionar Item </div>
        <div id="iadicao"  title="Adicionar Item ao Estoque?" style="background-color:#DDD">
            
            <div class="input-pai">
                <div class="input-filho">
                    <input type="text" name="txt[1]" id="itxt1" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[2]['nomecol']));?>' class="input-block" />
                </div>
                <div class="input-filho">
                    <input type="text" name="txt[2]" id="itxt2" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[3]['nomecol']));?>' class="input-block" />
                </div>
            </div>    
            <div class="input-pai">    
                <div class="input-filho">
                    <input type="text" name="txt[3]" id="itxt3" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[4]['nomecol']));?>' class="input-block" style="width: 98%"/>
                </div> 
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <input type="text" name="txt[4]" id="itxt4" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[5]['nomecol']));?>' class="input-block" />
                </div>
                <div class="input-filho">           
                    <input type="text" name="txt[5]" id="itxt5" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[6]['nomecol']));?>' class="input-block" />
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <select name="txt[6]" id="itxt6"  class="select-block">
                        <option value="" selected ><?php echo ucwords(str_replace("_", " ", $listaColunas[7]['nomecol']));?></option>
                        <?php foreach ($listaUnidades as $un):?>
                            <option value="<?php echo $un["id"];?>"><?php echo ucwords(utf8_encode($un["unidade"]));?></option>
                        <?php endforeach;?>
                    </select>
                </div>
                <div class="input-filho">           
                    <select name="txt[7]" id="itxt7" class="select-block">
                        <option value="" disabled selected><?php echo ucwords(str_replace("_", " ", $listaColunas[8]['nomecol']));?></option>
                        <option value='1' >Sim</option>
                        <option value='0' >Não</option>
                    </select>
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <input type="text" name="txt[8]" id="itxt8" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[9]['nomecol']));?>' class="input-block" />
                </div>
                <div class="input-filho">           
                    <input type="text" name="txt[9]" id="itxt9" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[10]['nomecol']));?>' class="input-block" />
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <input type="text" name="txt[10]" id="itxt10" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[11]['nomecol']));?>' class="input-block" />
                </div>
                <div class="input-filho">           
                    <input type="text" name="txt[11]" id="itxt11" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[12]['nomecol']));?>' class="input-block" />
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">           
                    <textarea name="txt[12]" id="itxt12" placeholder='<?php echo ucwords(str_replace("_", " ", $listaColunas[13]['nomecol']));?>' class="select-block"></textarea>
                </div>
            </div>
            <div class="input-pai">
                <div class="input-filho">
                    <div class="botao_st" onclick="confirmaAdicao()" style="margin: 10px"> Adicionar </div>
                </div>
                <div class="input-filho">
                    <div class="botao_st" onclick="cancelaAdicao()" style="margin: 10px"> Cancelar </div>
                </div>
                <div class="input-filho">
                    <div class="botao_stAux" onclick="limparInputsAdd()" style="margin: 10px; float:right"> Limpar Campos </div>
                </div>
            </div>
        </div>   
</div></div>   

<div >
    <table id="tabelaestoque" class="display nowrap" cellspacing="0"  style="width: 100%" >
        <thead>
            <tr>
                <th><input type="checkbox" onchange="selecionaTodos(this)" id="iselectodos"/>  Ações</th>
                <?php for($i = 2; $i< count($listaColunas)-2; $i++):?>
                    <th><?php echo ucwords(str_replace("_", " ", $listaColunas[$i]['nomecol']))?></th>
                <?php endfor;?>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($listaEstoque as $chave => $valor ):?>
                <tr>
                    <td>
                        <?php if(in_array("estoque_edt", $infoFunc["permissoesFuncionario"])):?>
                            <input type="hidden" value="<?php echo $listaEstoque[$chave][count($listaColunas)-2];?>"/>
                            <input type="checkbox" onchange="selecionaLinha(this)"/>
                            <div data-ident="<?php echo $valor["id"];?>" class="botao_peq_st" onclick="editar(this)">Editar</div>
                        <?php endif;?>
                    </td>

                    <?php for($col = 2; $col < count($listaColunas)-2; $col++):?>
                        <?php if($listaColunas[$col]["tipo"] == "date"):?>
                    
                            <?php if(floatval(str_replace("-", "",$listaEstoque[$chave][$col])) == 0):?>
                                <td></td>
                            <?php else:?>
                                <td><?php $dtaux = explode("-",$listaEstoque[$chave][$col]); echo $dtaux[2]."/".$dtaux[1]."/".$dtaux[0];?></td>
                            <?php endif;?>    
                                
                        <?php elseif ($listaColunas[$col]["tipo"] == "float"):?>

                            <td><?php echo str_replace(".",",",$listaEstoque[$chave][$col]);?></td>

                        <?php elseif ($listaColunas[$col]["tipo"] == "tinyint(4)"):?>
                            
                            <?php if(floatval($listaEstoque[$chave][$col]) == 0):?>
                                <td> Não </td>
                            <?php else:?>
                                <td> Sim </td>
                            <?php endif;?> 
                            
                        <?php else:?>

                                <td><?php echo utf8_encode(ucwords(strtolower($listaEstoque[$chave][$col])));?></td>

                        <?php endif;?>
                    <?php endfor;?>              
                </tr>
            <?php endforeach;?>
        </tbody>
    </table>
    
</div>   
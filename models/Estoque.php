<?php

class Estoque extends model {
    

    public function __construct($id = "") {
        parent::__construct(); 
    }
     
//    
    public function nomeDasColunas(){
       $array = array();
       
       $sql = "SHOW COLUMNS FROM estoque";      
       $sql = $this->db->query($sql);
       if($sql->rowCount()>0){
         $sql = $sql->fetchAll(); 
         foreach ($sql as $chave => $valor){
            $array[$chave] = array("nomecol" => utf8_encode(ucwords($valor["Field"])), "tipo" => $valor["Type"]);        
         }
       }       
       return $array;
    }
    
    public function pegarListaEstoque($empresa) {
       $array = array();
       
       $sql = "SELECT * FROM estoque WHERE id_empresa = '$empresa' AND situacao = 'ativo' ORDER BY id DESC";      
       $sql = $this->db->query($sql);
       if($sql->rowCount()>0){
         $array = $sql->fetchAll(); 
       }
       return $array; 
    }
    
        public function buscaProdsForn($nome,$empresa){
        $array = array();
        $string = '';
        if(!empty($nome) && !empty($empresa)){
            $sql = "SELECT produto FROM estoque WHERE fornecedor='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
            $sql = $this->db->query($sql);
            if($sql->rowCount()>0){
                $sql = $sql->fetchAll();
                foreach ($sql as $valor){
                  $array[] = ucwords( strtolower( utf8_encode($valor['produto'])));

                }
            } 
        }
         return $array;
    }
    
    public function buscaCodigoProduto($cod, $forn, $empresa){
        $array = array();
        if(!empty($cod) && !empty($forn) && !empty($empresa)){
            $sqlA = "SELECT sigla FROM fornecedores WHERE nomefantasia='$forn' AND id_empresa='$empresa'";
            $sqlA = $this->db->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetch();
                $sigla = $sqlA[0];
                $cod = $cod.$sigla;
                $sqlB = "SELECT codigo FROM estoque WHERE codigo='$cod' AND id_empresa = '$empresa' AND situacao='ativo'";
                $sqlB = $this->db->query($sqlB);
                if($sqlB->rowCount()>0){
                    $array = $sqlB->fetchAll();
                } 
            }             
        }
        return $array;
    }

//    public function buscaClientePeloEmail($nome,$empresa){
//        $array = array();
//        if(!empty($nome) && !empty($empresa)){
//            $sql = "SELECT email FROM clientes WHERE email='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
//            $sql = $this->db->query($sql);
//            if($sql->rowCount()>0){
//                $array = $sql->fetchAll();
//            } 
//        }
//        return $array;
//    }
   
//    public function buscaClientePeloCPF($nome,$empresa){
//        $array = array();
//        if(!empty($nome) && !empty($empresa)){
//            $sql = "SELECT cpf_cnpj FROM clientes WHERE cpf_cnpj='$nome' AND id_empresa = '$empresa' AND situacao='ativo'";
//            $sql = $this->db->query($sql);
//            if($sql->rowCount()>0){
//                $array = $sql->fetchAll();
//            } 
//        }
//        return $array;
//    }

    public function adicionar($txts,$empresa){
        
        if(count($txts) > 0 && !empty($empresa)){
            $resp = array();
            $forn = trim(addslashes($txts[0]));
            $sqlA = "SELECT sigla FROM fornecedores WHERE nomefantasia='$forn' AND id_empresa='$empresa'";
            $sqlA = $this->db->query($sqlA);
            if($sqlA->rowCount()>0){
                $sqlA = $sqlA->fetch();
                $sigla = $sqlA[0];
                
                
                $p = new Permissoes();
                $ipcliente = $p->pegaIPcliente();
                $alteracoes = ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

                //tratamento das informações vindas do formulário
                $txt1 =  trim(addslashes($txts[0]));        // forn
                $txt2 =  trim(addslashes($txts[1])).$sigla; // cod
                $txt3 =  trim(addslashes($txts[2]));        // prod
                $txt4 =  floatval(addslashes($txts[3]));    // custo
                $txt5 =  floatval(addslashes($txts[4]));    // venda
                $txt6 =  trim(addslashes($txts[5]));        // unid
                $txt7 =  trim(addslashes($txts[6]));        // granel
                $txt8 =  floatval(addslashes($txts[7]));    // qtd
                $txt9 =  floatval(addslashes($txts[8]));    // qtd min
                $txt10 = trim(addslashes($txts[9]));        // localiz
                $txt11 = trim(addslashes($txts[10]));       // ncm
                $txt12 = trim(addslashes($txts[11]));       // observ
                                    
                //montagem da query

                $sql = "INSERT INTO estoque (id, id_empresa, fornecedor, codigo, produto, valor_custo, valor_venda, unidade, venda_a_granel, quant_atual, quant_min, localizacao, ncm, observacao, alteracoes, situacao) VALUES ".

                "(DEFAULT, ".
                "'$empresa', ".
                "'$txt1', ".
                "'$txt2', ".
                "'$txt3', ".
                "'$txt4', ".
                "'$txt5', ".
                "'$txt6', ".
                "'$txt7', ".
                "'$txt8', ".
                "'$txt9', ".
                "'$txt10', ".
                "'$txt11', ".
                "'$txt12', ".
                "'$alteracoes', ".
                "'ativo')";
                
                $sql = $this->db->query($sql);
                $resp["id"] = $this->db->lastInsertId();
                $resp["alter"] = $alteracoes;
                return $resp;
            }
        }    
    }    
    
//     public function pegarInfoCliente($id,$empresa) {
//       $array = array();
//       
//       $sql = "SELECT * FROM clientes WHERE id='$id' AND id_empresa = '$empresa' AND situacao = 'ativo'";      
//       $sql = $this->db->query($sql);
//       if($sql->rowCount()>0){
//         $array = $sql->fetchAll(); 
//       }
//       return $array; 
//    }
    
//     public function editar($id, $txts, $empresa){
//        if(!empty($id) && !empty($empresa) && count($txts) >0 ){
//            
//            $p = new Permissoes();
//            $ipcliente = $p->pegaIPcliente();
//            //$altera = addslashes($txts[21])." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACAO";
//            
//            //tratamento das informações vindas do formulário
//            //tratamento das informações vindas do formulário
//            $txt1 =  trim(addslashes($txts[1])); // nome
//            $txt2 =       addslashes($txts[2]); // cpf / cnpj
//            $txt3 =       addslashes($txts[3]); // celular
//            $txt4 =  trim(addslashes($txts[4])); // operadora
//            $txt5 =       addslashes($txts[5]); // telefone
//            $txt6 =  trim(addslashes($txts[6])); // email
//            $txt7 =       addslashes($txts[7]); // cep
//            $txt8 =  trim(addslashes($txts[8])); // endereço
//            $txt9 =       addslashes($txts[9]); // numero
//            $txt10 = trim(addslashes($txts[10])); // complemento
//            $txt11 = trim(addslashes($txts[11])); // bairro
//            $txt12 = trim(addslashes($txts[12]));// cidade
//            $txt13 = trim(addslashes($txts[13])); // observacao
//            $txt14 = trim(addslashes($txts[14])); // contatos
//            
//            $altaux = $txts[16];
//            $altaux = str_replace("(*", "", $altaux);
//            $altaux = str_replace("*)", "", $altaux);
//            
//            $altera = "$txts[15] | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACAO >> $altaux";
//            
//            
//            //montagem da query
//            $sql = "UPDATE clientes SET ".
//                "nome =        '$txt1', ".
//                "cpf_cnpj =    '$txt2', ".
//                "celular=      '$txt3', ".
//                "operadora =   '$txt4', ".
//                "telefone =    '$txt5', ".
//                "email =       '$txt6', ".
//                "cep =         '$txt7', ".
//                "endereco =    '$txt8', ".
//                "numero =      '$txt9', ".
//                "complemento = '$txt10', ".
//                "bairro =      '$txt11', ".
//                "cidade =      '$txt12', ".
//                "observacao =  '$txt13', ".
//                "contatos =    '$txt14', ".
//                "alteracoes = '$altera' WHERE id = '$id' AND id_empresa = '$empresa'";
//            
//            $this->db->query($sql);
//
//        }
//    }
    
//    public function excluir($id,$empresa){
//        if(!empty($id) && !empty($empresa)){
//            
//            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
//            $sql = "SELECT alteracoes FROM clientes WHERE id = '$id' AND id_empresa = '$empresa' AND situacao = 'ativo'";
//            
//            $sql = $this->db->query($sql);
//            
//            if($sql->rowCount() > 0){  
//               $sql = $sql->fetch();
//               $palter = $sql["alteracoes"];
//               $p = new Permissoes();
//               $ipcliente = $p->pegaIPcliente();
//
//               $palter = $palter." | ".ucwords($_SESSION["nomeFuncionario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSAO";
//               
//               $sqlA = "UPDATE clientes SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' AND id_empresa = '$empresa'";
//               $this->db->query($sqlA);
//               
//            }
//        }
//    }
    
}

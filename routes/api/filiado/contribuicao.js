var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../../dbconfig.js');

/* POST contribuicao listing. */
router.post('/', async function(req, res, next) {  
    let connection;
    let mensagem = {};
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute(
        `CALL PKG_CONTRIBUICAO.INSERE('${req.body.codigo}','${req.body.nome}','${req.body.cpf}','${req.body.email}','${req.body.telefone}','${req.body.cidade}','${req.body.uf}')`,
        [],
        { autoCommit: true } 
      );
      mensagem = {
        mensagem:"Inserido com sucesso"
      }
    } catch (error) {
      console.log(error);
      mensagem = {
        mensagem:error.message,
        error
      };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error(error);
          res.json({
            mensagem:error.message,
            error
          });
        }
      }
    }
  
    res.json( mensagem );
    
});

/* GET contribuicao listing. */
router.get('/', async function(req, res, next) {  
    let connection;
    let mensagem = {};
    try {
      connection = await oracledb.getConnection(dbConfig);
      const result = await connection.execute(
        `select 
          codigo, 
          nome, 
          cpf, 
          email, 
          telefone, 
          cidade, 
          uf
        from filiado`,
        [],
        { autoCommit: true } 
      );
      
      mensagem = result;
  
    } catch (error) {
      console.log(error);
      mensagem = {
        mensagem:error.message,
        error
      };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error(error);
          res.json({
            mensagem:error.message,
            error
          });
        }
      }
    }
  
    res.json( mensagem );
    
});

module.exports = router;
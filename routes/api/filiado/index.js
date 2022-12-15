var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../../dbconfig.js');

/* POST ficha listing. */
router.post('/', async function(req, res, next) {  
  let connection;
  let mensagem = {};
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `CALL PKG_FILIADO.EDITA('${req.body.codigo}','${req.body.nome}','${req.body.cpf}','${req.body.email}','${req.body.telefone}','${req.body.cidade}','${req.body.uf}')`,
      [],
      { autoCommit: true } 
    );
    mensagem = {
      mensagem:"Editado com sucesso"
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

/* GET FILIADO listing. */
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

/* DELETE FILIADO listing. */
router.delete('/', async function(req, res, next) {
    let connection;
    let mensagem = {};
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute(
        `CALL PKG_FILIADO.EXCLUIR('${req.body.filiado}')`,
        [],
        { autoCommit: true } 
      );
      mensagem = {
        mensagem:"Excluído com sucesso"
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

module.exports = router;
var express = require('express');
var router = express.Router();
const oracledb = require('oracledb');
const dbConfig = require('../../../dbconfig.js');

/* POST homologação de ficha listing. */
router.post('/', async function(req, res, next) {
  let connection;
  let mensagem = {};
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `CALL PKG_FICHA.HOMOLOGAR('${req.body.ficha}')`,
      [],
      { autoCommit: true } 
    );
    mensagem = {
      mensagem:"Homologado com sucesso"
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
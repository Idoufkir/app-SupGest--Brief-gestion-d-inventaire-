const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;




const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'app_inventaire'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('Database Connected!');
});


app.use(express.static(path.join(__dirname, 'public','css')));
app.use(express.static(path.join(__dirname, 'public','img')));
app.use(express.static(path.join(__dirname, 'public','lib')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));





//------------------------------------Routes Parts ----------------------------------//

app.get('/', (req, res) => {
    const sql = "SELECT id_P,nameP,prix,quantite,societe,nameF,tel,email,nameR,categorie FROM  ((produit INNER JOIN fournisseur ON produit.id_F = fournisseur.id_F) INNER JOIN rayon ON produit.id_R = rayon.id_R)";
       connection.query(sql, (err, rows) => {
        console.log(rows);
           if (err) throw err;
           res.render('index', {
            title : 'index',
               rows: rows
           });
   
       })
   
   });

//--------------------------Routes Parts Stock " Produit - Rayon - Fournisseur " ----------------------------------//


//--------------------------"   Produits  " ----------------------------------//

app.get('/produits',(req, res) => {

    let sql = " SELECT * FROM produit,fournisseur ";
    connection.query(sql, (err, rows) => {
       console.log(rows);
        if(err) throw err;
        res.render('produits', {
            title : 'Tout les produits',
            rows : rows
        });

    });
});



app.get('/add-produit',(req, res) => {
    let idR;
    let idF;
    let sql1 = "SELECT id_R,nameR FROM rayon";
    let sql2 =  "SELECT id_F,nameF FROM fournisseur";
    connection.query(sql1, (err, rows) => {
  
      idR = rows;
        if(err) throw err;
        connection.query(sql2, (err, rows) => {
          idF = rows;
            if(err) throw err;
        res.render('add-produit', {
            title : 'Ajouter Un produit',
            idR : idR,
            idF : idF
  
        });
        });
          });
  });



  app.post('/save-produit',(req, res) => {

    let data = {id_R: req.body.id_R, id_F: req.body.id_F, nameP: req.body.nameP,categorie: req.body.categorie, quantite: req.body.quantite, prix: req.body.prix};
    let sql = "INSERT INTO produit SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/produits');
    });
});



app.get('/edit/p/:idP',(req, res) => {

    const idP = req.params.idP;
    let idR;
    let idF;
    let sql1 = `SELECT id_R,nameR FROM rayon where id_R = ${idP}`;
    let sql2 =  `SELECT id_F,nameF FROM fournisseur where id_P = ${idP}`;
    let sql = `Select * from produit where id_P = ${idP}`;
    connection.query(sql, (err, rows) => {
  
        idR = rows;
          if(err) throw err;
          connection.query(sql1, (err, rows) => {
            idF = rows;
              if(err) throw err;
          res.render('modifier-produit', {
              title : 'Modifier Un produit',
              row : result[0],
              idR : idR,
              idF : idF
    
          });
          });
            });
    });

app.post('/updatep',(req, res) => {

    let idP = req.body.id_P;
    let sql = `UPDATE produit SET id_R = '${req.body.id_R}', id_F = '${req.body.id_F}', nameP = '${req.body.nameP}', categorie = '${req.body.categorie}', quantite = '${req.body.quantite}', prix = '${req.body.prix}' where id_P = ${idP}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/produits');
    });
});



app.get('/delete/p/:idP',(req, res) => {
    const idP = req.params.idP;
    let sql = `DELETE from produit where id_P = ${idP}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/produits');
    });
});

//--------------------------"   Rayons  " ----------------------------------//


    app.get('/rayons',(req, res) => {

    let sql = "SELECT * FROM rayon";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('rayons', {
            title : 'Explorer les Rayons',
            rows : rows
        });

    });
})

app.get('/add-rayon',(req, res) => {

    res.render('add-rayon', {
        title : 'Ajouter Un Nouveau Rayon',

    });

});

app.post('/save-rayon',(req, res) => {

    let data = {nameR: req.body.nameR};
    let sql = "INSERT INTO rayon SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/rayons');
    });
});


app.get('/edit/r/:idR',(req, res) => {

    const idR = req.params.idR;
    let sql = `Select * from rayon where id_R = ${idR}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('modifier-rayon', {
            title : 'Modification de Rayon',
            row : result[0]
        });
    });
});

app.post('/updater',(req, res) => {

    let idR = req.body.id_R;
    let sql = `UPDATE rayon SET nameR = '${req.body.nameR}' where id_R = ${idR}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/rayons');
    });
});



app.get('/delete/r/:idR',(req, res) => {
    const idR = req.params.idR;
    let sql = `DELETE from rayon where id_R = ${idR}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/rayons');
    });
});





//--------------------------"   Fournisseurs  " ----------------------------------//



app.get('/frs',(req, res) => {

    let sql = "SELECT * FROM fournisseur";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('frs', {
            title : 'Nos Fournisseur',
            rows : rows
        });

    });
});


app.get('/add-frs',(req, res) => {

    res.render('add-frs', {
        title : 'Ajouter Un Nouveau Fournisseur',

    });

});

app.post('/save-frs',(req, res) => {

    let data = {nameF: req.body.nameF, societe: req.body.societe, adress: req.body.adress, email: req.body.email, tel: req.body.tel};
    let sql = "INSERT INTO fournisseur SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/frs');
    });
});

app.get('/edit/f/:idF',(req, res) => {

    const idF = req.params.idF;
    let sql = `Select * from fournisseur where id_F = ${idF}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('modifier-frs', {
            title : 'Modification de Frs',
            row : result[0]
        });
    });
});

app.post('/updatef',(req, res) => {

    let idF = req.body.id_F;
    let sql = `UPDATE fournisseur SET nameF = '${req.body.nameF}', societe = '${req.body.societe}', adress = '${req.body.adress}', email = '${req.body.email}', tel = '${req.body.tel}' where id_F = ${idF}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/frs');
    });
});



app.get('/delete/f/:idF',(req, res) => {
    const idF = req.params.idF;
    let sql = `DELETE from fournisseur where id_F = ${idF}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/frs');
    });
});










app.listen(port, (error)=>{
  console.log(`Listening on port ${port}`);
});

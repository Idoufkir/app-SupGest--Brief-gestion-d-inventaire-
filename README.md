
------------------------------------------------------------------------------------------------------------
|              Création d'une application de gestion d’inventaire avec NodeJS, ExpressJS, EJS et MySQL         |
------------- ----------------------------------------------------------------------------------------------


Firstable go Ampps open server then go to phpmyadmin create database then create table with 3 columns id auto_increment name 
description then follow bellow steps:


Step 1 : open new folder then install  npm init 
			 
		
Step 2 : Install Requred packages using NPM like this ===> 
			==> npm install  body-parser ejs express mysql  --save
			
		
Step 3 : Add follwoing code in app.js & Create Database Connection 
                       

		        const path = require('path');
            const express = require('express');
            const ejs = require('ejs');
            const bodyParser = require('body-parser');
            const mysql = require('mysql');
            const app = express();
            const port = process.env.PORT || 3000;
                        


                   //  Listing Server 
                      app.listen(port, (error)=>{
                      console.log(`Listening on port ${port}`);
                    });


			        const mysql=require('mysql');
			
			        const connection=mysql.createConnection({
			            host:'localhost',
			            user:'root',
			            password:'// put your password //',
			            database:'// put name of your database //)'
		        	});
			
		          connection.connect((error)=>{
                  if(error) console.log(error);
                  console.log('Database Connected!');
               });

Setp 4 : Define view engin with ejs / public path / view files path / bodyParser/express static

			        app.use(express.static(path.join(__dirname, 'public','css')));
			        app.use(express.static(path.join(__dirname, 'public','img')));
			        app.use(express.static(path.join(__dirname, 'public','lib')));
			        app.use(bodyParser.json());
			        app.use(bodyParser.urlencoded({ extended: false }));
			        app.set('view engine', 'ejs');
			        app.set('views',path.join(__dirname,'views'));

Setp 5 : Define index path with '/' and ejs file
			
		
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

Setp 6 : Run a server and check with Browser
			node app

			http://localhost:3000/
			
Step 7 : Get value from database and show in ejs template
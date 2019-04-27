var dbMySql = require('../dbConnection');
var fs = require('fs');
var fsX = require('fs-extra');

module.exports = {

    checkExistHouse : function(req, res){
      var sqlQuery = "SELECT * FROM casas WHERE nombre = ?";
      dbMySql.query(sqlQuery, [req.params.nombre], function(error, results, fields){
       if (error) throw error;
       res.end(JSON.stringify(results));
      });
    },

    getHouse: function(req, res){
      var sqlQuery = "SELECT * FROM casas WHERE PK_Id_Casa = ?";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
       if (error) throw error;
       res.end(JSON.stringify(results));
      });
    },

    getAllHouses : function(req, res){
    	var sqlQuery = "SELECT PK_Id_Casa, nombre, foto_portada, habitaciones_libres, habitaciones_ocupadas, calle, numero, colonia  FROM casas";
  		dbMySql.query(sqlQuery, function(error, results, fields){
    	 if (error) throw error;
    	 res.end(JSON.stringify(results));
      });
    },

    getAvailableHouses : function(req, res){
      var sqlQuery = "SELECT * FROM casas WHERE habitaciones_libres > 0";
      dbMySql.query(sqlQuery, function(error, results, fields){
        if (error) throw error;
        res.end(JSON.stringify(results));
      });
    },

    getIdHouse : function(req, res){
      //Obtener Primary Key Casa Mediante Su Nombre
      console.log("inside getIdHouse");
      var sqlQuery = "SELECT nombre FROM casas WHERE PK_Id_Casa = ?";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
        if (error) throw error;
        console.log(results);
        res.end(JSON.stringify(results));
      });
    },

    getNameHouse : function(req, res){
      var sqlQuery = "SELECT FK_Id_Casa FROM habitaciones WHERE PK_Id_habitacion = ?";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
        if (error)throw error;
        if(results.length > 0){
          var pkIdHouse = results[0].FK_Id_Casa;
          sqlQuery = "SELECT nombre FROM casas WHERE PK_Id_Casa = "+pkIdHouse;
          dbMySql.query(sqlQuery, function(error, results, fields){
            if (error) throw error;
            console.log(results);
            res.end(JSON.stringify(results));
          });
        }
        else{
          res.end(JSON.stringify(results));
        }
      });
    },

    getAddressHouseByIdRoom : function(req, res){
      console.log(req.params);
      var sqlQuery = "SELECT Direccion FROM habitaciones WHERE PK_Id_habitacion = ?";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
        if (error) throw error;
        res.end(JSON.stringify(results));
      });
    },

    getAddressHouseByIdHouse : function(req, res){
      console.log(req.params);
      var sqlQuery = "SELECT  Direccion FROM habitaciones WHERE FK_Id_Casa = ? LIMIT 1";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
        if (error) throw error;
        res.end(JSON.stringify(results));
      });
    },

    getAvailableRoomsByHouse : function(req, res){
        //Obtener Habitaciones Disponibles Por Casa
        console.log("getAvailableRoomsByHouse");
        var sqlQuery = "SELECT * FROM habitaciones WHERE FK_Id_Casa = ? AND disponible ='Si'";
        dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
          });
    },

    getAvailableRoomsAllHouses : function(req, res){
        //Obtener Habitaciones Disponibles Todas Las Casas
        console.log("HOLALAAA");
        var sqlQuery = "SELECT * FROM habitaciones WHERE disponible = 'Si'";
        dbMySql.query(sqlQuery, function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    },

    getAllRoomsByHouse : function(req, res){
        //Obtener Todas Habitaciones Por Casa
        var sqlQuery = "SELECT * FROM habitaciones WHERE FK_Id_Casa = ?";
        dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
          });
    },

    getAllRoomsAllHouses : function(req, res){
        //Obtener Todas Habitaciones Todas Las Casas
        console.log('getAllRoomsAllHouses');
        var sqlQuery = "SELECT * FROM habitaciones";
        dbMySql.query(sqlQuery, function(error, results, fields){
            if (error) throw error;
            res.end(JSON.stringify(results));
          });
    },

    getPriceCatalogRoomHouse : function(req, res){
      console.log('fdfdfdf');
      var sqlQuery = "SELECT precio FROM habitaciones WHERE PK_Id_habitacion = ?";
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
       if (error) throw error;
       res.end(JSON.stringify(results));
      });
    },

    getImagesRoomByHouse : function(req, res){
      var sqlQuery = "SELECT * FROM imagenes WHERE FK_Id_Casa ="+req.params.id;
      dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
       if (error) throw error;
       res.end(JSON.stringify(results));
      });
    },

    addHouse : function(req, res){
      //'use strict'
      console.log(req.body.detailsRoomsHouse);
      console.log(req.body.urlImagesRoomsHouse);
      var arrayDataRooms = JSON.parse(req.body.detailsRoomsHouse);
      var arrayUrlImagesRooms = JSON.parse(req.body.urlImagesRoomsHouse);
      var pkIdLastHouseInserted = 0;
      var pkIdLastRoomInserted = 0;
      var indexRoom = 0;
      var params = { 'nombre':req.body.nameHouse, 'calle':req.body.nameStreet, 'numero':req.body.numberHouse, 
                     'colonia':req.body.nameNeighborhood, 'municipio':req.body.countyHouse, 
                     'estado':req.body.stateHouse, 'foto_portada':req.body.frontImageHouse,
                     'habitaciones_libres':req.body.availableRoomsHouse, 'habitaciones_ocupadas':0, 
                     'numero_habitaciones':req.body.availableRoomsHouse, 'tel':req.body.telephoneHouse,
                     'cel':req.body.phoneHouse, 'mapa':req.body.locationHouse };

      var insertInformationHousePromise = new Promise(function(resolve, reject){
        var sqlQuery = "INSERT INTO casas SET ?"; 
        dbMySql.query(sqlQuery, params, function(error, results, fields){
          if (error) {
            return reject(error);
          }//if
          else{
            //resolve(res.status(201).send({ message: 'Informacion Almacenada con Exito' }));
            var sqlQuery = "SELECT MAX(PK_Id_Casa) as maxId FROM casas";
            dbMySql.query(sqlQuery, function(error, results, fields){
              if (!error){
                //console.log(results[0].maxId);
                resolve(results[0].maxId);
              }
              else{
                reject(error);
              }
            });
          }//else
        });
      });

      function insertInformationRoom(pkIdLastHouseInserted){
        var insertInformationRoomPromise = new Promise(function(resolve, reject){
          for(let i = 0; i < arrayDataRooms.length; i++){
            let nameRoom = arrayDataRooms[i].nameRoom;//Nombre Habitacion
            let addressRoom = req.body.nameStreet +' '+req.body.numberHouse +' '+req.body.nameNeighborhood;//Direccion Habitacion
            let numberOfRoom = arrayDataRooms[i].roomNumber;//Numero Habitacion
            let priceRoom = arrayDataRooms[i].priceRoom;//Precio Habitacion
            var params = {'FK_Id_Casa':pkIdLastHouseInserted,'Nom_Hab':nameRoom, 'Direccion':addressRoom, 
                          'Num_Hab':numberOfRoom, 'tamanio':'4mts x 4mts', 'disponible':'Si', 'precio':priceRoom};
            var sqlQuery = "INSERT INTO habitaciones SET ?";
            dbMySql.query(sqlQuery, params, function(error, results, fields){
              if (error) {
                return reject(error);
              }
              /*else{
                resolve(res.end());
              }*/
            });
          }//for
          var sqlQuery = "SELECT PK_Id_habitacion FROM habitaciones ORDER BY PK_Id_habitacion DESC LIMIT 0,"+arrayDataRooms.length;
              dbMySql.query(sqlQuery, function(error, results, fields){
                if (!error){
                  resolve(results);
                }
                else{
                  reject(error);
                }
              });
        });
        return insertInformationRoomPromise;
      }

      function insertUrlImagesRoom(roomsInserted, lastHouseInserted){

        var insertUrlImagesRoomsPromise = new Promise(function(resolve, reject){
        var sqlQuery = "INSERT INTO imagenes SET ?";
        for(let j = 0; j <arrayUrlImagesRooms.length; j++ ){//Insertar Urls Imagenes Habitacion
          console.log("for arrayUrlImagesRooms");
          let numberRoom = arrayUrlImagesRooms[j].roomNumber;
              for(let k = 0; k < arrayUrlImagesRooms[j].urlImage.length; k++){
                  let urlImages = arrayUrlImagesRooms[j].urlImage;//Arreglo URLs Imagenes
                  let urlImg = urlImages[k];
                  var params = {'FK_Id_Casa':lastHouseInserted, 'FK_Id_habitacion':roomsInserted[j], 'url_imagen':urlImg };
                  console.log("inside for k");
                  dbMySql.query(sqlQuery, params, function(error, results, fields){
                    if (error) {
                      reject(error);
                    }
                    else{
                     //resolve(res.status(201).send({ message: 'Informacion Almacenada con Exito' }));
                      resolve(res.end());
                    }
                  });
              }//k
        }//j
        });
        return insertUrlImagesRoomsPromise;
      }


      insertInformationHousePromise.then(function (results){
        pkIdLastHouseInserted = results;
        insertInformationRoom(results).then(function (results){
          var lastRoomsInserted = [];
          for(let i = 0; i < results.length; i++)
            lastRoomsInserted.push(results[i].PK_Id_habitacion);
          insertUrlImagesRoom(lastRoomsInserted.sort(), pkIdLastHouseInserted).then(function(results){
            console.log(results);//Finaliza Algoritmo
          });
        });
      });

    },

    updateHouse : function(req, res){
      console.log(req.body.detailsRoomsHouse);

      var detailsRoomsHouse = JSON.parse(req.body.detailsRoomsHouse);
      var newRoomsAdded = JSON.parse(req.body.arrayNewRoomsAdded);
      var newUrlImgAdded = JSON.parse(req.body.arrayNewUrlImgAdded);
      var deletedRooms = JSON.parse(req.body.arrayDeletedRooms);

      var params = { 'nombre':req.body.nameHouse, 'calle':req.body.nameStreet, 'numero':req.body.numberHouse, 
                     'colonia':req.body.nameNeighborhood, 'municipio':req.body.countyHouse, 
                     'estado':req.body.stateHouse, 'foto_portada':req.body.frontImageHouse,
                     'tel':req.body.telephoneHouse,'cel':req.body.phoneHouse, 'mapa':req.body.locationHouse };

      var updateNameFolderHousePromise = new Promise(function(resolve, reject){
        console.log("updateNameFolderHouse");
        var originalNameImagesRoomsFolder = "../img/img-uploaded/img-habitaciones/"+req.body.oldNameHouse;
        var newNameImagesRoomsFolder = "../img/img-uploaded/img-habitaciones/"+req.body.nameHouse;
        console.log(originalNameImagesRoomsFolder+"\n"+newNameImagesRoomsFolder);
        fs.rename(originalNameImagesRoomsFolder, newNameImagesRoomsFolder, (err) => {
          if (err) {
            reject(err)
          return
          }
          else{ 
            var sqlQuery = "UPDATE imagenes SET url_imagen = REPLACE(url_imagen, ?, ?) WHERE FK_Id_Casa = ?";
            dbMySql.query(sqlQuery, [originalNameImagesRoomsFolder, newNameImagesRoomsFolder,req.body.PkIdHouseToUpdate], function(error, results, fields){
              if(error) 
                reject(error);
              else{
                //resolve(res.end());
                var sqlQuery = "UPDATE casas SET foto_portada = REPLACE(foto_portada, ?, ?) WHERE PK_Id_Casa = ?";
                dbMySql.query(sqlQuery, [originalNameImagesRoomsFolder, newNameImagesRoomsFolder,req.body.PkIdHouseToUpdate], function(error, results, fields){
                  if(error) 
                    reject(error);
                  else{
                    resolve(res.end());
                  }
                });
              }
            });
          }
          //done
        })
      });

      var updateInformationHousePromise = new Promise (function (resolve, reject){
        var sqlQuery = "UPDATE casas SET nombre = ?, calle = ?, numero = ?, colonia = ?, municipio = ?, estado = ?, "+ 
        "tel = ?, cel = ?, mapa = ?, foto_portada = ? WHERE PK_Id_Casa = ?";
        dbMySql.query(sqlQuery, [req.body.nameHouse, req.body.nameStreet, req.body.numberHouse, req.body.nameNeighborhood,
          req.body.countyHouse,req.body.stateHouse, req.body.telephoneHouse, req.body.phoneHouse, req.body.locationHouse, 
          req.body.urlFrontImgHouse, req.body.PkIdHouseToUpdate], function(error, results, fields){
          if (error) reject(error);
          else
            resolve(results);
            //resolve(res.status(201).send({ message: 'Informacion Casa Actualizada con Exito' }));
        });
      });

      var updateInformationRoomsHousePromise = new Promise (function(resolve, reject){
        for(let i = 0; i < detailsRoomsHouse.length; i++ ){
          console.log("inside detailsRoomsHouse");
          let nameRoom = detailsRoomsHouse[i].Nom_Hab;//Nombre Habitacion
          let addressRoom = req.body.nameStreet +' '+req.body.numberHouse +' '+req.body.nameNeighborhood;//Direccion Habitacion
          let numberOfRoom = detailsRoomsHouse[i].Num_Hab;//Numero Habitacion
          let priceRoom = detailsRoomsHouse[i].precio;//Precio Habitacion
          let pkIdRoom = detailsRoomsHouse[i].PK_Id_habitacion;//Id Habitacion

          console.log(nameRoom + addressRoom + numberOfRoom + priceRoom + pkIdRoom);

          sqlQuery = "UPDATE habitaciones SET Nom_Hab = ?, precio = ? WHERE FK_Id_Casa = ? AND PK_Id_habitacion = ?";
          dbMySql.query(sqlQuery, [nameRoom, priceRoom, req.body.PkIdHouseToUpdate, pkIdRoom], function(error, results, fields){
            if (error) reject(error);
            else{
              res.end();
              //resolve(res.send("Habitaciones Actualizadas Con Exito"));//Habitaciones Actualizadas correctamente
            }
          });           
        }//for
        //resolve(res.status(201).send({ message: 'Informacion Habitaciones Actualizada con Exito' }));//Habitaciones Actualizadas correctamente
      });

      var deleteUrlImagesRoomsHousePromise = new Promise(function(resolve, reject){
        for(let i = 0; i < deletedRooms.length; i++){
          var pkIdRoom = deletedRooms[i];//PK Habitacion
          console.log(pkIdRoom);
          console.log("dentro de DELETE FROM imagenes");
          sqlQuery = "DELETE FROM imagenes WHERE FK_Id_habitacion = ?";
          dbMySql.query(sqlQuery, [pkIdRoom], function(error, results, fields){
            if (error) reject(error);
            else{
              resolve(res.end());//Numero Habitaciones Casa Actualizado

            }//else
          });  
        }//for
      });

      var deleteRoomsHousePromise = new Promise(function(resolve, reject){
        console.log("dentro de deleteRoomsHousePromise");
        for(let i = 0; i < deletedRooms.length; i++){
          var pkIdRoom = deletedRooms[i];//PK Habitacion
          console.log(pkIdRoom);
          var sqlQuery = "DELETE FROM habitaciones WHERE PK_Id_habitacion = ?";
          dbMySql.query(sqlQuery, [pkIdRoom], function(error, results, fields){
            if (error) reject(error);
            else{
              sqlQuery = "UPDATE casas SET habitaciones_libres = habitaciones_libres - 1, "+
              "numero_habitaciones = numero_habitaciones - 1 WHERE PK_Id_Casa = "+req.body.PkIdHouseToUpdate;
              dbMySql.query(sqlQuery, function(error, results, fields){
                if (error) 
                  reject(error);
                else
                  resolve(res.end());//Numero Habitaciones Casa Actualizado
              });
            }
          });  
        }//for
      });

      var insertInformationRoomPromise = new Promise(function(resolve, reject){
          for(let i = 0; i < newRoomsAdded.length; i++){
            console.log("inside insertInformationRoom");
            let nameRoom = newRoomsAdded[i].nameRoom;//Nombre Habitacion
            let addressRoom = req.body.nameStreet +' '+req.body.numberHouse +' '+req.body.nameNeighborhood;//Direccion Habitacion
            let numberOfRoom = newRoomsAdded[i].roomNumber;//Numero Habitacion
            let priceRoom = newRoomsAdded[i].priceRoom;//Precio Habitacion
            var params = {'FK_Id_Casa':req.body.PkIdHouseToUpdate,'Nom_Hab':nameRoom, 'Direccion':addressRoom, 
                          'Num_Hab':numberOfRoom, 'tamanio':'4mts x 4mts', 'disponible':'Si', 'precio':priceRoom};
            
            var sqlQuery = "INSERT INTO habitaciones SET ?";
            dbMySql.query(sqlQuery, params, function(error, results, fields){
              if (error) {
                return reject(error);
              }
              /*else{
                resolve(res.end());
              }*/
            });
          }//for
          if(newRoomsAdded.length > 0){
              var sqlQuery = "UPDATE casas SET habitaciones_libres = habitaciones_libres + ?, "+
              "numero_habitaciones = numero_habitaciones + ? WHERE PK_Id_Casa = "+req.body.PkIdHouseToUpdate;
              dbMySql.query(sqlQuery, [newRoomsAdded.length, newRoomsAdded.length], function(error, results, fields){
                if (error) 
                  reject(error);
                else
                  resolve(res.end());//Numero Habitaciones Casa Actualizado
              });
          }  
      });

      var insertUrlImagesRoomsHousePromise = new Promise (function(resolve, reject){
        var sqlQuery = "SELECT PK_Id_habitacion FROM habitaciones ORDER BY PK_Id_habitacion DESC LIMIT 0,"+newRoomsAdded.length;
              dbMySql.query(sqlQuery, function(error, results, fields){
                if (!error)
                  //return resolve(results);
                  var lastRoomsInserted = [];
                for(let i = 0; i < results.length; i++)
                  lastRoomsInserted.push(results[i].PK_Id_habitacion);
                lastRoomsInserted = lastRoomsInserted.sort();

                  var sqlQuery = "INSERT INTO imagenes SET ?";
                  for(let j = 0; j <newUrlImgAdded.length; j++ ){//Insertar Urls Imagenes Habitacion
                    console.log("for arrayUrlImagesRooms");
                    let numberRoom = newUrlImgAdded[j].roomNumber;
                      for(let k = 0; k < newUrlImgAdded[j].urlImage.length; k++){
                        let urlImages = newUrlImgAdded[j].urlImage;//Arreglo URLs Imagenes
                        let urlImg = urlImages[k];
                        var params = {'FK_Id_Casa':req.body.PkIdHouseToUpdate, 'FK_Id_habitacion':lastRoomsInserted[j], 'url_imagen':urlImg };
                        console.log("inside for k");
                        dbMySql.query(sqlQuery, params, function(error, results, fields){
                          if (error) {
                            reject(error);
                          }
                          else{
                            //resolve(res.status(201).send({ message: 'Informacion Almacenada con Exito' }));
                              resolve(res.end());
                          }
                        });
                      }//k
                  }//j
                });
      });

      updateInformationHousePromise.then(function(results){
        updateInformationRoomsHousePromise.then(function(results){
          if(deletedRooms.length > 0){//Eliminaron Habitaciones
            deleteRoomsHousePromise.then(function(results){
              deleteUrlImagesRoomsHousePromise.then(function(results){

              }); 
            }); 
          }//if

          if(newRoomsAdded.length > 0){//Agregaron Habitaciones
            insertInformationRoomPromise.then(function(results){
              insertUrlImagesRoomsHousePromise.then(function(results){

              })
            });
          }//if

          if(req.body.nameHouse!=req.body.oldNameHouse){
            updateNameFolderHousePromise.then(function(results){

            });
          }//if

        });
      });

    },

    deleteHouse : function(req, res){

      console.log(req.params.id);
      console.log(req.params.nombreCasa);
      var getNumberOccupiedRoomsHousePromise = new Promise(function(resolve, reject){
        var sqlQuery = "SELECT habitaciones_ocupadas FROM casas WHERE PK_Id_Casa = ?";//Validar Casa No Tenga Clientes Hospedados
        dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
          if (error) 
            reject(error);
          else
            resolve(results[0].habitaciones_ocupadas);
        });
      });

      getNumberOccupiedRoomsHousePromise.then(function(results){
        var occupiedRooms = results;
        console.log(occupiedRooms);
        if(occupiedRooms > 0){
          let message = ['Casa Tiene Clientes Hospedados'];
          res.end(JSON.stringify(message));
        }
        else{
          var sqlQuery = "DELETE FROM imagenes WHERE FK_Id_Casa = ?";
          dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
            if (error) throw error;
            sqlQuery = "DELETE FROM habitaciones WHERE FK_Id_Casa = ?";
              dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
                if (error) throw error;
                sqlQuery = "DELETE  FROM casas WHERE PK_Id_Casa = ?";
                  dbMySql.query(sqlQuery, [req.params.id], function(error, results, fields){
                  if (error) throw error;
                  fsX.remove("../img/img-uploaded/img-habitaciones/"+req.params.nombreCasa, err => {
                    console.error(err)
                  })
                  res.end(JSON.stringify(results));
                });
              });
          });
        }
      });
    },

    uploadHouseImages : function(req,res){

        console.log(req.body);
        console.log(req.file);
        console.log(req.destination);

        console.log("inside uploadImages");
        console.log(req.files);
        //res.send(req.files);
        res.end("File is uploaded");
    }
    
  }
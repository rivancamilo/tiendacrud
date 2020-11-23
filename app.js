const express = require("express");
const path = require("path");
const bodyParse = require("body-parser");
const mongoose = require("mongoose");
const Usuarios = require("./models/usuarios");
const Paises = require("./models/pais");
const validator = require("validator");
const aplicacion = express();
const puerto = 3900;

aplicacion.use(bodyParse.urlencoded({ extended: false }));
aplicacion.use(bodyParse.json());
//aplicacion.set('view engine', 'ejs');

aplicacion.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

/**********************************************************
    Configuracion 
**********************************************************/
aplicacion.set("port", process.env.PORT || puerto);
/*  1)  Realizamos la conexion con  la base da datos  */
mongoose
    .connect(
        "mongodb+srv://ivan:ivan1234@cluster0.3vi7z.mongodb.net/tiendacrud?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((db) => console.log(`Conecion exitosa MongoDB`))
    .catch((err) => console.log(err));

/**********************************************************
Listar todos los usuarios
**********************************************************/
aplicacion.get("/api/usuarios", async(req, res) => {
    const lisUsuarios = await Usuarios.find();
    const paises = await Paises.find();
    //if (lisUsuarios.length > 0) {

    //res.json({ data: lisUsuarios });
    return res.status(200).send({
        status: "success",
        usuarios: lisUsuarios,
        paises: paises,
    });
    /* 
    } else {
        res.json({ errors: ["No se encontro Informacion"] });
        res.status(404);
    } */
});

/**********************************************************
    Registrar un Usuario
**********************************************************/
aplicacion.post("/api/nuevousuario", async(req, res) => {
    const usuario = new Usuarios(req.body);
    await usuario.save();

    return res.status(200).send({
        status: "success",
        usuario,
    });
});

/*********************************************************
    Actualizar un usuario
**********************************************************/
aplicacion.post("/api/editarusuario/:id", async(req, res) => {
    const { id } = req.params; //obtenemos el id del usuario
    const datosFinales = req.body;

    await Usuarios.update({ _id: id }, datosFinales);
    return res.status(200).json({
        status: "success",
        usurio: datosFinales,
    });
});

/*********************************************************
    Eliminar un usuario
*********************************************************/
aplicacion.get("/api/borrarusuario/:id", async(req, res) => {
    const { id } = req.params; //obtenemos el id del registro
    /* const usuario = await Usuarios.findById(id); //buscar el usuario
    const datosFinales = req.body; */

    await Usuarios.remove({ _id: id }); //eliminamos el registro
    return res.status(200);
});

/*********************************************************
    lenvantar servicio NODEJS en el puerto 8080
**********************************************************/
aplicacion.listen(aplicacion.get("port"), () => {
    console.log(`Iniciando el servico `);
});
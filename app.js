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
aplicacion.set('view engine', 'ejs');

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



/***********************************************************
    Listamos todos los usuarios
***********************************************************/
aplicacion.get('/', async(req, res) => {
    const usuarios = await Usuarios.find()
    res.render('paginas/index', { usuarios });
});

/**********************************************************
    Rednderiza el formulario para crear nuevo Usuario
**********************************************************/
aplicacion.get("/nuevousuario", (req, res) => {
    res.render('paginas/nuevoUser');
});

/*********************************************************
    Creamos el usuario en la BD 
 *********************************************************/
aplicacion.post("/procesarRegistro", async(req, res) => {

    const usuario = new Usuarios(req.body);
    await usuario.save();
    res.redirect('/');
});

/*********************************************************
    Renderizamos el formulario con los datos del Usuario
**********************************************************/
aplicacion.get('/editar/:id', async(req, res) => {
    const { id } = req.params; //obtenemos el id del usuario
    const datosUsuario = await Usuarios.findOne({ _id: id });
    res.render('paginas/editarUser', { usuario: datosUsuario });

});

/**********************************************************
    Actualizamos los datos del formulario
**********************************************************/
aplicacion.post('/editar/:id', async(req, res) => {
    const { id } = req.params; //obtenemos el id del usuario
    const datosFinales = req.body;
    await Usuarios.update({ _id: id }, datosFinales);
    res.redirect('/');
});

/*********************************************************
    Eliminar un usuario
*********************************************************/
aplicacion.get("/borrar/:id", async(req, res) => {
    const { id } = req.params; //obtenemos el id del registro
    await Usuarios.remove({ _id: id }); //eliminamos el registro
    res.redirect('/');
});











/**********************************************************
Listar todos los usuarios EN EL API
**********************************************************/
aplicacion.get("/api/usuarios", async(req, res) => {
    const lisUsuarios = await Usuarios.find();
    const paises = await Paises.find();

    return res.status(200).send({
        status: "success",
        usuarios: lisUsuarios,
        paises: paises,
    });
});

/**********************************************************
    Registrar un Usuario desde la API
**********************************************************/
aplicacion.post("/api/nuevousuario", async(req, res) => {
    const usuario = new Usuarios(req.body);
    await usuario.save((err, usuario) => {

        if (err || !usuario) {
            return res.status(404).send({
                status: 'error',
                message: 'El usuario no se ha guardado !!!'
            });
        }

        // Devolver una respuesta 
        return res.status(200).send({
            status: 'success',
            usuario
        });

    });

    /*return res.status(200).send({
    status: "success",
    usuario,
    }); */
});


/*********************************************************
    Muestra los datos actuales del Usuario en el API
**********************************************************/
aplicacion.get("/api/editarusuario/:id", async(req, res) => {
    const { id } = req.params; //obtenemos el id del usuario

    const datosUsuario = await Usuarios.findOne({ _id: id });
    if (!datosUsuario) {
        return res.status(204).json({
            status: "Error",
            usuario: "Usuario no encontrado",
        });
    } else {
        return res.status(200).json({
            status: "success",
            usuario: datosUsuario,
        });
    }

});



aplicacion.put("/api/editarusuario/:id", async(req, res) => {
    const { id } = req.params; //obtenemos el id del usuario

    await Usuarios.update({ _id: id }, req.body);
    return res.status(200).json({
        status: "success"
    });
});

/*********************************************************
    Eliminar un usuario
*********************************************************/
aplicacion.delete("/api/borrarusuario/:id", async(req, res) => {

    const { id } = req.params; //obtenemos el id del registro
    await Usuarios.remove({ _id: id }); //eliminamos el registro
    return res.status(200);

});

/*********************************************************
    lenvantar servicio NODEJS en el puerto 8080
**********************************************************/
aplicacion.listen(aplicacion.get("port"), () => {
    console.log(`Iniciando el servico `);
});
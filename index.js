const express = require("express")
const sequelize = require("./database/connection/db")
const app = express()
const port = process.env.PORT || 3000
require("dotenv").config()

async function connection() {

    try {
        sequelize.authenticate()
        console.log("Connexion réussie")

        sequelize.sync({alter: true})
        console.log("Base de donnée synchronisé")
    } catch (error) {
        console.log("Une erreur s'est produite: ", error)
    }

}
connection()

app.listen(port, () => {
    try {
        console.log(`Serveur démarré sur le port http://localhost:${port}`)
    } catch (error) {
        console.log(`Erreur l'ors du démarage du serveur ${error}`)
    }
})
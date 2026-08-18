const express = require("express")
const sequelize = require("./database/connection/db")
const appRoute = require("./app.routes")
const { User, CourierProfile, CourierPricing } = require("./database/models/relations/relations.model")
const Otp = require("./database/models/tables/otps.model")
const Policy = require("./database/models/tables/policies.model")
const app = express()
const port = process.env.PORT || 3000
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(appRoute)

async function connection() {
    try {
        await sequelize.authenticate()
        console.log("Connexion réussie")

        await sequelize.sync({ alter: true })
        console.log("Base de donnée synchronisé")
    } catch (error) {
        console.log(`Une erreur s'est produite: ${error}`)
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
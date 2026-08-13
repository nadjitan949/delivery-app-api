const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("dotenv").config()

app.get("/", (req, res) => {
    try {
        res.json({
            message: "Salut"
        })
    } catch (error) {
       console.log("Erreur survenus") 
    }
})

app.listen(port, () => {
    try {
        console.log(`Serveur démarré sur le port http://localhost:${port}`)
    } catch (error) {
        console.log(`Erreur l'ors du démarage du serveur ${error}`)
    }
})


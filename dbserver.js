const express = require("express");
const dbloader = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const app = express();


const db = dbloader(path.resolve(__dirname, "database.db"));


const schema = fs.readFileSync(
    path.resolve(__dirname, "schema.sql"),
    "utf-8"
);
db.exec(schema);

app.get("/api/user", (req, res) => { //:id
    const id = parseInt(req.params.id, 10);  

    
    if (isNaN(id)) {
        return res.sendStatus("ID must be a number")(400); 
        return
    }


    const data = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    if (!data) {
        return res.sendStatus(404);  
    } else {
        return res.json(data);  
    }
});


app.listen(3000, () => {
    console.log("Listening at port 3000");
});

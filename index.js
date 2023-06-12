const express = require ("express");
const cors = require ("cors");
const { Sequelize } = require ("sequelize");

const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running at port ${PORT}`)
});

//configuration database
const db = new Sequelize('recommendation', 'root', '', {
    host: 'localhost', //sql instance public IP
    dialect: 'mysql'
});

try {
    db.authenticate();
    console.log('Database Connected...')
} catch (error) {
    console.log(error);    
};

app.use(cors({ credentials: true, origin: '0.0.0.0'}));
app.use(express.json());

const {DataTypes} = Sequelize;
const Rec = db.define('recommendation', {
    Land_name: DataTypes.STRING,
    TypeofSoil: DataTypes.STRING,
    soil_pH: DataTypes.STRING,
    Soil_Organic: DataTypes.STRING,
    Plant_Type: DataTypes.STRING
}, {
    freezeTableName: true
});

// // create table;
// (async() => {
//     await db.sync();
// })();

//get all of data Recommendation
app.get('/DataRec', async(req, res) => {
    try {
        const rec = await Rec.findAll({
            attributes: ['id', 'Land_Name', 'TypeofSoil', 'soil_pH', 'Soil_Organic', 'Plant_Type']
        });
        res.json(rec);
    } catch (error) {
        console.log(error);
    }
});

//get data Recommendation by Id
app.get('/DataRec/:id', async(req, res) => {
    try {
        const rec = await Rec.findOne({
            attributes: ['id', 'Land_Name', 'TypeofSoil', 'soil_pH', 'Soil_Organic', 'Plant_Type'],
            where: {
                id: req.params.id
            }
        });
        res.json(rec);
    } catch (error) {
        console.log(error);
    }
});

//create new data recommendation
app.post('/newRec', async(req, res) => {
    const {Land_name, TypeofSoil, soil_pH, Soil_Organic, Plant_Type} = req.body;
    //create data into db
    try {
        await Rec.create({
            Land_name: Land_name,
            TypeofSoil: TypeofSoil,
            soil_pH: soil_pH,
            Soil_Organic: Soil_Organic,
            Plant_Type: Plant_Type
        });
        res.json({msg: "Created Success"});
    } catch (error) {
        console.log(error);
    }
});

//delete data recommendation by id
app.delete('/DataRec/:id', async(req, res) => {
    const id = req.params.id;
    //delete from db
    try {
        await Rec.destroy({
            where: {id: id},
        });
        res.json({msg: "Data was deleted"})
    } catch (error) {
        console.log(error);        
    }
});

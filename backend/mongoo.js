// const { response } = require("express");

// const mongooClient = require("mongodb").MongoClient;

// const url = "mongodb+srv://samarth:samarth@cluster0.eqcxard.mongodb.net/myawsmcart?retryWrites=true&w=majority"


// const createProduct = async (req,res,next)=>{
//     const newProduct = {
//         name:req.body.name,
//         price:req.body.price
//     }
//     const client = new mongooClient(url);
//     try{
//         await client.connect();
//         const db = client.db()
//         const result = await db.collection('products').insertOne(newProduct);
//     }catch(e){
//         return res.json({message:"could not connnect"})
//     }
//     client.close();
//     res.json(newProduct)
// }


// const getProduct = async(req,res,next)=>{

// }




// exports.createProduct = createProduct
// exports.getProduct = getProduct
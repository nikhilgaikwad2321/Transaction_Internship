const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dotenv = require('dotenv');
const homeRoute=require('./routes/home');
const statisticsRouter = require('./routes/statistics');
const barChartRouter=require('./routes/chart');
const combinedRouter=require('./routes/combined');
const productRoutes=require('./routes/product');

const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();
let port=process.env.PORT;
let mongourl=process.env.MONGODB_URL;

async function main(){
    await mongoose.connect(mongourl);
}
main()
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err);
    });

app.use('/products', productRoutes);//show the products and perform pagination and searching
app.use('/products/combined',combinedRouter);//combines statiscts and barchart api response to get on response and show it at once 
app.use('/products/home',homeRoute);//intializes the database from the data provided by url
app.use('/products/statistics',statisticsRouter);//shows the total sale amount sold unsold items 
app.use('/products/bar-chart',barChartRouter);//shows the data that is needed for bar char and pie chart


app.listen(port,()=>{
    console.log(`server is listening to the port ${port}`);
});
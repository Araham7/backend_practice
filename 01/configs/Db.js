import mongoose from "mongoose"

const connectToDb = async () => {
    mongoose.connect(process.env.DB_URL)
                            .then((conn)=>{
                                console.log(`Connected to Db > ${conn.connection.host}`);
                                
                            })
                            .catch((error)=>{
                                console.log(error.message);
                                process.exit(1);
                            })
}

export { connectToDb };
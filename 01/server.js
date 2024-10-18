import 'dotenv/config'
import { app } from "./app.js";

const PORT = process.env.PORT || 9598;

app.listen(process.env.PORT , ()=>{
    console.log(`Server is running at > http://localhost:${PORT}`);
})

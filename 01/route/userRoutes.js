import { Router } from "express"; // Importing router.
import { jwtAuth } from "../middleware/jwtAuth.js"; // Importing "jwtAuth" middleware.
import { signUp , signIn , getUser , logOut , getAllUsers , deleteUser} from "../controllers/userController.js"; // Importing controller :---


const router = Router();

router.post("/signup", signUp); // POST method for creating a new user.
router.post("/signin", signIn); // POST method for user sign-in.
router.get("/getuser", jwtAuth , getUser);  // GET method to fetch a specific user by ID.
router.post("/logout", jwtAuth , logOut);   // POST method for user logout.
router.get("/getusers" , getAllUsers); // GET method to fetch all users.
router.delete("/deleteuser" , deleteUser);





export { router };

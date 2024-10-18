import JWT from "jsonwebtoken";

const jwtAuth = (req , res , next)=>{

    const token = (req.cookies && req.cookies.token) || null;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Not authorized! Token is missing."
        })
    }

    try {
        const payload = JWT.verify(token , process.env.SECRET);
        // if (!payload) {
        //     return res.status(400).json({
        //         success: false,
        //         msg: "Not authorised!"
        //     })
        // }

        /*
        req.user : A new property user is being added to the req object. This property will hold information about the authenticated or authorized user.
        */
        req.user = {
            id: payload.id,
            email: payload.email
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

export { jwtAuth };

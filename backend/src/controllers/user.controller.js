const userService=require("../services/user.service")

const getUserProfile=async (req,res)=>{
    try {
        const jwt= req.headers.authorization?.split(' ')[1];

        if(!jwt){
            return res.status(404).send({error:"token not found"})
        }
        const user=await userService.getUserProfileByToken(jwt)

        return res.status(200).send(user)

    
    } catch (error) {
        console.log("error from controller - ",error)
        return res.status(500).send({error:error.message})
    }
}

// const getAllUsers=async(req,res)=>{
//     try {
//         const users=await userService.getAllUsers()
//         return res.status(200).send(users)
//     } catch (error) {
//         return res.status(500).send({error:error.message})
//     }
// }

const getAllUsers = async (req, res) => {
  try {
    // Accept both page/limit (from AdminFront) and pageNumber/pageSize
    const pageNumber = req.query.pageNumber || req.query.page || 1;
    const pageSize = req.query.pageSize || req.query.limit || 10;

    const result = await userService.getAllUsers({ pageNumber, pageSize });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


module.exports={getUserProfile,getAllUsers}
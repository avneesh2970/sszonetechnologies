const express = require("express");
const router = express.Router();
const AdminSetting = require("../models/adminSettingModel");

router.post("/", async (req, res) => {
  try {
    console.log("Incoming body:", req.body);   // 👀 check this in terminal

    const { firstName, lastName, userName, phoneNumb, skill, displayNamePubliclyAs, bio } = req.body;

    const adminSetting = await AdminSetting.create({
      firstName,
      lastName,
      userName,
      phoneNumb,
      skill,
      displayNamePubliclyAs,
      bio,
    });

    res.status(200).json({
      success: true,
      message: "Setting added successfully",
      data: adminSetting,
    });
  } catch (error) {
    console.error("Error adding setting:", error); // 👀 log full error
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding settings",
      error: error.message,
    });
  }
});



router.get('/' , async(req , res)=>{
    try {
        const data = await AdminSetting.find()
        res.status(201).send({success : true , message : "Fetch Admin Setting" , data })
    } catch (error) {
        res.status(201).send({success : true , message : " error in Fetching Admin Setting" , error })
    }
})


router.put('/:id' , async(req , res)=>{
    try {
        const {firstName,
      lastName,
      userName,
      phoneNumb,
      skill,
      displayNamePubliclyAs,
      bio,} = req.body

    const updateSetting = await AdminSetting.findByIdAndUpdate(
        req.params.id , {
        firstName,
      lastName,
      userName,
      phoneNumb,
      skill,
      displayNamePubliclyAs,
      bio,
    })
    if(!updateSetting){
        return res.status(404).json({
            success : false , 
            message : "Admin Setting not found"
        })
    }
    res.status(200).json({
            success : true , 
            message : "Admin Setting update successfully",
            data : updateSetting
        })

    } catch (error) {
        res.status(500).json({
      success: false,
      message: "Error updating Admin Setting",
      error: error.message,
    })
    }
})

module.exports = router;

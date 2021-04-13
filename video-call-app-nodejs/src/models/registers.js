const mongoose=require("mongoose");
//const bcrypt=require("bcryptjs")
var validateEmail=function(email) {
    var re= /^\W+([\.-]?\W+)*@\W+([\.-]?\W+)*(\.\W{2,3})+$/;
    return re.test(email)
};


const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:[true,"Email address canot be blank"],
        unique: true,
        //validate: [validateEmail,"Please fill a valid email address"],
        //match: [/^\W+([\.-]?\W+)*@\W+([\.-]?\W+)*(\.\W{2,3})+$/, "Please fill a valid email address"]
    },
    password: {
        type:String,
        required:[true,"Password cannot be blank"]
    },
    cpassword: {
        type:String,
        required:true
    }
})

/*userSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password)

    }
    
    next();
})*/

const Register=new mongoose.model("Register",userSchema);
module.exports=Register;

import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import "./../css/input.css";
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";
import { registerRoute } from "../utils/ApiRoutes";

function register() {
  const navigate = useNavigate()
  const [value, setvalue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toast_options = {
    position : "bottom-right",
    theme : "dark",
    pauseOnHover : true,
    draggable : true,
    autoClose : 4000

  }

  const handlechange = (event) => {
    setvalue((prev)=>{
      return {...prev,[event.target.name]:event.target.value}
    })
  };

  const handleValidation = ()=> {
    const {username,email,password,confirmPassword} = value

    if(password !== confirmPassword ){
      toast.error("password and confirm Password same",toast_options)
      return false

    } else if(username.length < 3){
      toast.error("Username cointains mininum 4 characters",toast_options)
      return false

    } else if(password.length < 3){
      toast.error("Password is greater than 8 characters",toast_options)
      return false

    } else if(email === ""){
      toast.error("Email required",toast_options)
      return false
    }
    // toast.success("User Created",toast_options)
    return true
  }

  useEffect (()=>{
    const user_login = JSON.parse(localStorage.getItem("chat-app-user"))
    if(user_login){
      navigate("/")
    }
  },[])


  const handlesubmit = async(event) => {
    event.preventDefault();
    try{
      if(handleValidation()){
        const {username,email,password} = value
        const {data} = await axios.post(registerRoute,{
          username,email,password
        })
        
        
        if(data.status === false){
          toast.error(data.msg,toast_options)
        }
        
        if(data.status === true){
          navigate("/login")
          
        }
        
      }
    }catch(ex){
      
    }
  }

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center gap-[1rem] items-center bg-[#131324]">
        <form
          className="flex flex-col gap-[2rem] p-[2rem_3rem] rounded-[2rem] bg-[#00000076]"
          onSubmit={(event)=>{handlesubmit(event)}}
        >
          <div className="brand flex items-center gap-[1rem] justify-center">
            <img className="h-[4rem] " src={Logo} alt="logo" />
            <h1 className="text-white uppercase text-[30px]">SuperChat</h1>
          </div>

          <input
            className="input"
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handlechange(e)}
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handlechange(e)}
            
          />
          <input
            className="input"
            type="text"
            placeholder="Password"
            name="password"
            onChange={(e) => handlechange(e)}
          />
          <input
            className="input"
            type="password"
            placeholder="confirm Password"
            name="confirmPassword"
            onChange={(e) => handlechange(e)}
          />

          <button
            className="bg-[#4e0eff] text-[white] py-[0.5rem] px-[2rem] border-none font-bold cursor-pointer rounded-[0.4rem] text-[1rem] uppercase hover:bg-[#4e0eff]"
             
          >
            Create User
          </button>
          <span className="text-[white] uppercase ">
            Already have an account ?{" "}
            <Link to="/login" className="text-[#4e0eff] underline font-bold">
              Login in
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
}


export default register;

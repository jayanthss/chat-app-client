import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import "./../css/input.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loginRoute, tokenCheckRoute } from "../utils/ApiRoutes";
import { api } from "../api/axios";

function login() {
  const navigate = useNavigate();
  const [value, setvalue] = useState({
    username: "",
    password: "",
  });

  const toast_options = {
    position: "bottom-right",
    theme: "dark",
    pauseOnHover: true,
    draggable: true,
    autoClose: 4000,
  };

  const handlechange = (event) => {
    setvalue((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleValidation = () => {
    const { username, password } = value;

    if (username.length === "") {
      toast.error("Email and Password is Required", toast_options);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is Required", toast_options);
      return false;
    }
    // toast.success("User Created",toast_options)
    return true;
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("chat-app")
        if(token){
          const res_ser = await api.post(tokenCheckRoute);
          
          if (!res_ser.data.status) {
            toast.error(res_ser.data.message, toast_options);
            return;
          }
  
          navigate("/");

        }

      } catch (ex) {
        console.log(ex);
      }
    })();
  }, []);

  const handlesubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = value;
      const { data } = await api.post(loginRoute, {
        username,
        password,
      });
      console.log(data,"in handle submit")

      if (data.status === false) {
        toast.error(data.msg, toast_options);
      }

      if (data.status === true) {
        const chat_app = {
          username: username,
          isAvatarImageSet: data.isset,
          avatarImage: data.image,
          _id: data._id,
        };

        localStorage.setItem("Token", data.Token);
        if (data.isset) {
          localStorage.setItem("chat-app-user", JSON.stringify(chat_app));
          navigate("/");
          return;
        }
        navigate("/setAvatar");
      }
    }
  };

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center gap-[1rem] items-center bg-[#131324]">
        <form
          className="flex flex-col gap-[2rem] p-[2rem_3rem] rounded-[2rem] bg-[#00000076] "
          onSubmit={(event) => {
            handlesubmit(event);
          }}
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
            type="text"
            placeholder="Password"
            name="password"
            onChange={(e) => handlechange(e)}
          />

          <button className="bg-[#4e0eff] text-[white] py-[0.5rem] px-[2rem] border-none font-bold cursor-pointer rounded-[0.4rem] text-[1rem] uppercase hover:bg-[#4e0eff]">
            LOGIN
          </button>
          <span className="text-[white] uppercase ">
            Dont't have account{" "}
            <Link to="/register" className="text-[#4e0eff] underline font-bold">
              Register
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default login;

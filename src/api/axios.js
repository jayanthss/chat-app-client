import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("response recived");
    return response; 
  },

  async (error) => {
    console.log("response recived",error.response?.status);

    const originalRequest = error.config;

    if (
      error.response?.status === 401 
    ) {


      try {
        const res = await api.post("/api/auth/refresh");
        const newAccessToken = res.data.access_token;

        // store new token
        localStorage.setItem("Token", newAccessToken);

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
        
        console.log(originalRequest);
        return api(originalRequest);
      } catch (err) {
        console.log("eroor in axios",err);
        // refresh failed → logout
        localStorage.clear();
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export {api}
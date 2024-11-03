
import {
  signOut,
  getAuth,
} from "../../config/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const useLogout = ()=>{
  let navigate = useNavigate();

 const logOut=()=> {

    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("Sign-out successful.");
        toast.success("User sign out!", {
          position: "top-center",
        });
      })
      .catch((error) => {
        // An error happened.
        // console.log(error);
      });
  }
  return logOut;
};



import React from "react";
import './Login.css'
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "../config/firebase";
import { useNavigate } from "react-router-dom";
import Button from "../Functions/Button";
import { toast } from "react-toastify";

function Login() {
  let navigate = useNavigate();


  const signUp = () => {
    navigate("/signup");
  };

  function signIn() {
    const auth = getAuth();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log(user.email, "successfully logged in");
        if (!user.emailVerified) {
          // console.log("userEmail is", userEmail);
          // console.log(user);
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // window.alert("Email verification sent!");
              toast.error("Verify your email first!", {
                position: "top-center",
              });
              navigate("/emailverification");
              // ...
            })
            .catch((error) => {
              // An error happened.
              // console.log(error);
            });
        }
        else {
          navigate("/profile");
        }

      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (errorCode === "auth/invalid-credential") {
          toast.error("Wrong password or user not found!", {
            position: "top-center",
          })
        }
        else if (errorCode === "auth/invalid-email") {
          toast.error("Wrong email address!", {
            position: "top-center",
          })
        } else if (errorCode === "auth/network-request-failed"){
          toast.error("Network failed, No Internet !", {
            position: "top-center",
          })
        } else {
          console.log(errorCode);
        }
      });
  };

  return (
    <div className="login">
      <table >
        <thead >
          <tr style={{ textAlign: "center" }}>
            <th colSpan={2}>LOGIN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Email</td>
            <td>
              <input type="email" name="email" id="email"
                placeholder="Enter your email address"
              />
            </td>
          </tr>
          <tr>
            <td>Password</td>
            <td>
              <input type="password" name="password" id="password"
                placeholder="Enter your password"
              />
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ textAlign: "center" }}>
              <Button
                value={"SIGN IN"}
                id="signIn-btn"
                onClick={() => signIn()}
                class="btn btn-primary"
              ></Button>
              <br />
              <hr />
              <label style={{ textAlign: "left" }} > Don't have an account? </label>
              <Button
                type="button"
                value={"SIGN UP"}
                id="signUp-btn"
                onClick={signUp}
                class="btn btn-secondary"
              ></Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Login;

import React from "react";
import Button from "../Button";
import { getAuth, createUserWithEmailAndPassword } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  let navigate = useNavigate();

  //   function checkPassword() {
  //     let password = document.getElementById("password").value;
  //   }

  const signUp = () => {
    const auth = getAuth();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let message = document.getElementById("message");

    if (password.length != 0) {
      if (password === confirmPassword) {
        message.textContent = "Password Matched";
        message.style.backgroundColor = "#3ae374";
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            toast.success("Signed up!", {
              position: "top-center",
            })
            navigate("/profile");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            if (errorCode === "auth/email-already-in-use") {
              toast.error("email already in use!", {
                position: "top-center",
              })
            }
            else if (errorCode === "auth/weak-password") {
              toast.error("weak password!", {
                position: "top-center",
              })
            } else {
              console.log(errorCode);
            }

          });

      } else {
        message.textContent = "Password not matched";
        message.style.backgroundColor = "#ff4d4d";
      }
    } else {
      alert("Password can't be empty");
      message.textContent = "";
    }

  };

  const signIn = () => {
    navigate("/login");
  };


  return (
    <div>
      <div className="login">
        <table>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th colSpan={2}>CREATE A NEW ACCOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email</td>
              <td>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter a new email address"
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter a new password"
                />
              </td>
            </tr>
            <tr>
              <td>Confirm Password</td>
              <td>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Re-Enter your password"
                //   onChange={checkPassword}
                />
                <p id="message"></p>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button
                  type="button"
                  value={"SIGN UP"}
                  id="signUp-btn"
                  onClick={signUp}
                  class="btn btn-success"
                ></Button>
                <br />
                <hr />
                <label style={{ textAlign: "left" }} > Already have an account? </label>

                <Button
                  value={"SIGN IN"}
                  id="signIn-btn"
                  onClick={signIn}
                  class="btn btn-secondary"
                ></Button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Signup;

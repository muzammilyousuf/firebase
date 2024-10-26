import { React, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  collection,
  doc,
  addDoc,
  db,
  getDocs,
  auth,
  updateDoc,
} from "../../config/firebase";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

function Profile() {
  let navigate = useNavigate();
  let userEmail;
  let docId;

  function userAuthentication() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        userEmail = user.email;

        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          // console.log(`${doc.id} => ${doc.data()}`);
          if (doc.data().email == userEmail) {
            document.getElementById("fname").value = doc.data().first;
            document.getElementById("lname").value = doc.data().last;
            document.getElementById("dob").value = doc.data().dob;
            document.getElementById("create-profile-btn").value =
              "UPDATE PROFILE";
          }
        });
        if (!user.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              window.alert("Email verification sent!");
              navigate("/login");
              // ...
            })
            .catch((error) => {
              // An error happened.
              console.log(error);
            });
        }
      } else {
        navigate("/login");
        // User is signed out
        // ...
      }
    });
  }

  useEffect(() => {
    userAuthentication();
  }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const createProfile = async () => {
    if (
      (document.getElementById("create-profile-btn").value = "UPDATE PROFILE")
    ) {
      try {
        const docRef = doc(db, "users", docRef.id);
        await updateDoc(docRef, {
          first: document.getElementById("fname").value,
          last: document.getElementById("lname").value,
          dob: document.getElementById("dob").value,
          email: userEmail,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: document.getElementById("fname").value,
          last: document.getElementById("lname").value,
          dob: document.getElementById("dob").value,
          email: userEmail,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <div>
      <div className="login">
        <table>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th colSpan={2}>CREATE PROFILE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>First Name</td>
              <td>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  placeholder="Enter your First Name"
                />
              </td>
            </tr>
            <tr>
              <td>Last Name</td>
              <td>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  placeholder="Enter your Last Name"
                />
              </td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>
                <input type="date" name="dob" id="dob" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button
                  value={"CREATE PROFILE"}
                  id="create-profile-btn"
                  onClick={createProfile}
                  class="btn btn-success"
                ></Button>
                <br />
                <hr />
                <Button
                  value="SIGN OUT"
                  id="signOut-btn"
                  onClick={logOut}
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

export default Profile;

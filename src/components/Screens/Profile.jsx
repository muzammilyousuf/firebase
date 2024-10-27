import { React, useState, useEffect } from "react";
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
  deleteDoc,
} from "../../config/firebase";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

function Profile() {
  let navigate = useNavigate();
  let userEmail;
  
  let userId;
  let docId;

  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const updateProfile = async () => {
    console.log("Update Profile Call");
    console.log(docId);
    if (docId){
    await deleteDoc(doc(db, "users", docId));
    console.log("Deleted :", docId );
    // docId = false;
    
    // createProfile();
  }
  };

  function userAuthentication() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
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
        } else{
        userEmail = user.email;
        console.log(userEmail);
        console.log(user);

        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          // console.log(`${doc.id} => ${doc.data()}`);
          if (doc.data().email === userEmail) {
            userId = doc.id;
            setUser(doc.data());
            User.fname = doc.data().first;
            User.lname = doc.data().last;
            User.dob = doc.data().dob;
            User.gender = doc.data().dob;
            User.city = doc.data().city;
            document.getElementById("create-profile-btn").value = "UPDATE PROFILE";
            if(document.getElementById("create-profile-btn").value = "UPDATE PROFILE"){
              updateProfile();
            }  
          };
        })
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

  const [User, setUser] = useState({
    email: userEmail,
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    city: "",
  });

  // const buttonText = User.city != "" ? "UPDATE PROFILE" : "CREATE PROFILE";

  const createProfile = async () => {
    // if (document.getElementById("create-profile-btn").value = "UPDATE PROFILE"){
    //   try{
    //     await deleteDoc(doc(db, "users", docId));
    //    }
    //    catch (e) {
    //      console.error("Error deleting document: ", e);
    //  }
    // }
    console.log(userEmail);
    console.log(User.email);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        fname: User.fname,
        lname: User.lname,
        dob: User.dob,
        gender: User.gender,
        city: User.city,
        email: userEmail || User.email,
      });

      console.log("Document written with ID: ", docRef.id);
      docId = docRef.id;
      // document.getElementById("create-profile-btn").value = "UPDATE PROFILE";
    } catch (e) {
      console.error("Error adding document: ", e);
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
                  value={User.fname}
                  onChange={handleChange}
                  required
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
                  value={User.lname}
                  placeholder="Enter your Last Name"
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Date of Birth</td>
              <td>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={User.dob}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    id="gender"
                    value="male"
                    checked={User.gender === "male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={User.gender === "female"}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={User.gender === "other"}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </td>
            </tr>
            <tr>
              <td>City</td>
              <td>
                <select
                  name="city"
                  value={User.city}
                  onChange={handleChange}
                  required
                >
                  <option>Select your City </option>
                  <option> Karachi </option>
                  <option> Islamabad </option>
                  <option> Peshawar </option>
                </select>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button
                  value="CREATE PROFILE"
                  // {"CREATE PROFILE"}
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

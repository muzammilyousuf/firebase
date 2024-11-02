import { React, useState, useEffect, useRef } from "react";
import {
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  collection,
  addDoc,
  db,
  getDocs,
  getAuth,
  // updateProfile,
  doc,
  // setDoc,
  // updateDoc,
  deleteDoc,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from "../../config/firebase";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import no_dp from "./no dp.jpeg"

const Profile = () => {
  let navigate = useNavigate();
  // let docId;
  // let userEmail;
  // let CreateProfile;

  const valueRef = useRef('');

  const [docId, setDocId] = useState("");

  const [User, setUser] = useState({
    id: docId,
    displayPicture: valueRef.imageUrl,
    first: "",
    last: "",
    dob: "",
    gender: "",
    city: "",
    phoneNumber: "",
    email: valueRef.userEmail,
    CreateProfile: "CREATE PROFILE",
  });


  const handleChange = (e) =>
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {

    const auth = getAuth();

    const userAuthentication = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid; // ali_id: abc and moshin_id: efg
        // console.log(user); // email ali@test.com and moshin@test.com

        if (user.email && uid) {
          valueRef.userEmail = user.email

          if (!user.emailVerified) {
            // console.log("userEmail is", userEmail);
            // console.log(user);
            sendEmailVerification(auth.currentUser)
              .then(() => {
                // window.alert("Email verification sent!");
                toast.error("Kindly verify your email first!", {
                  position: "top-center",
                });
                navigate("/login");
                // ...
              })
              .catch((error) => {
                // An error happened.
                // console.log(error);
              });
          } else {
            toast.success("successfully logged in", {
              position: "top-center",
            })
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
              // console.log(`${doc.id} => ${doc.data()}`);
              if (doc.data().email === valueRef.userEmail) {
                setDocId(doc.id);
                document.getElementById('previewPicture').setAttribute('src', doc.data().displayPicture)
                document.getElementById("displayPicture").name = doc.data().displayPicture
                document.getElementById('title').textContent = "UPDATE PROFILE"
                setUser(doc.data());
              }
            });
          }
        }
        else {
          navigate("/login");
          console.log("User is signed out");
          // toast.error("User is signed out", {
          //   position: "top-center",
          // });
          // ...
        }
      }
    });

    return () => userAuthentication();
  }, []);



  function logOut() {
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
  };



  const createProfile = async () => {
    // console.log(docId)
    if (User.CreateProfile === "UPDATE PROFILE" && docId) {
      try {
        await deleteDoc(doc(db, "users", docId));
        console.log(docId, "deleted successfully!")
      }
      catch (e) {
        console.error("Error deleting document: ", e);
      }
    }

    //   userupdateProfile();
    // }
    // else {
    //   console.log(docId, "docId is not found")
    //   }
    // } 
    // else {
    // console.log("userEmail is", valueRef.userEmail);


    try {
      const docRef = await addDoc(collection(db, "users"), {
        // id: User.id || docId,
        email: User.email || valueRef.userEmail,
        displayPicture: valueRef.imageUrl,
        first: User.first,
        last: User.last,
        dob: User.dob,
        gender: User.gender,
        city: User.city,
        phoneNumber: User.phoneNumber,
        CreateProfile: "UPDATE PROFILE"
      });
      // document.getElementById("create-profile-btn").value = "UPDATE PROFILE";
      console.log("Document written with ID: ", docRef.id);
      userupdateProfile();

      User.CreateProfile = "UPDATE PROFILE"
      // docId = docRef.id
      // valueRef.docId = docRef.id
      setDocId(docRef.id);

      // console.log("docId is", docId);

    } catch (e) {
      console.error("Error adding document: ", e);
    }
    // }
  };

  // const CreateProfile = User.id != "" ? "UPDATE PROFILE" : "CREATE PROFILE";



  const userupdateProfile = async () => {
    console.log("Update Profile Call");

    if (User.CreateProfile === "UPDATE PROFILE") {
      toast.success("USER PROFILE UPDATED!", {
        position: "top-center",
      });
    } else {
      toast.success("USER PROFILE CREATED!", {
        position: "top-center",
      });
    }

    // await deleteDoc(doc(db, "users", docId));


    // const docIdDocRef = doc(db, "users", docId);
    // await setDoc(docIdDocRef, {
    //   first: User.first,
    //   last: User.last,
    //   dob: User.dob,
    //   gender: User.gender,
    //   city: User.city,
    // });

    // // To update age and favorite color:
    // await updateDoc(docIdDocRef, {
    //   first: User.first,
    //   last: User.last,
    //   dob: User.dob,
    //   gender: User.gender,
    //   city: User.city,
    // });


    //   updateProfile(auth.currentUser, {
    //     email: User.email,
    //     first: User.first,
    //     last: User.last,
    //     dob: User.dob,
    //     gender: User.gender,
    //     city: User.city,
    //   })
    //     .then(() => {
    //       console.log(docId, "docId is updated!");
    //       // Profile updated!
    //       // ...
    //     })
    //     .catch((error) => {
    //       // console.log(error);
    //       // An error occurred
    //       // ...
    //     });
  };


  function uploadProfile() {
    var dp = document.getElementById("displayPicture").files[0];
    // console.log(dp)

    if (dp != undefined) {
      console.log("UPLOAD FUNCTION CALL")
      const dpRef = ref(storage, `${dp.name}`);

      // 'file' comes from the Blob or File API
      if (dpRef != "")
        uploadBytes(dpRef, dp).then((snapshot) => {
          console.log('Uploaded a blob or file!');
          toast.success("Display Picture Uploaded!", {
            position: "top-center",
          });
        });

      const uploadTask = uploadBytesResumable(dpRef, dp);


      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');

              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);

          });
        }
      );

      getDownloadURL(ref(storage, `${dp.name}`))
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();

          // Or inserted into an <img> element
          const img = document.getElementById('previewPicture');
          img.setAttribute('src', url);
          valueRef.imageUrl = url;

        })
        .catch((error) => {
          // Handle any errors
        });
    }
    else {
      toast.error("Choose Profile Picture first!", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <div className="login">
        <table>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th colSpan={2}> <label id="title"> CREATE PROFILE </label></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div id="dp" style={{ textAlign: "center" }} >
                  <img id="previewPicture" class="rounded-circle" src={no_dp} />
                  <input
                    type="file"
                    name="displayPicture"
                    id="displayPicture"
                  >
                  </input>
                  <Button
                    value="UPLOAD"
                    id="upload"
                    onClick={() => uploadProfile()}
                    class="btn btn-info"
                  ></Button>
                </div>
              </td>

            </tr>

            <tr>
              <td>First Name</td>
              <td>
                <input
                  type="text"
                  name="first"
                  id="fname"
                  placeholder="Enter your First Name"
                  value={User.first}
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
                  name="last"
                  id="lname"
                  value={User.last}
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
            <tr>
              <td>Phone Number</td>
              <td>
                <input
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={User.phoneNumber}
                  placeholder="Enter your Phone Number"
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button
                  value={User.CreateProfile}
                  // value="CREATE PROFILE"
                  id="create-profile-btn"
                  onClick={createProfile}
                  class="btn btn-success"
                ></Button>
                <br />
                <hr />
                <Button
                  value="SIGN OUT"
                  id="signOut-btn"
                  onClick={() => logOut()}
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

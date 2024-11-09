import { React, useState, useEffect, useRef } from "react";
import {
  onAuthStateChanged,
  sendEmailVerification,
  collection,
  addDoc,
  db,
  getDocs,
  getAuth,
  doc,
  deleteDoc,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from "../config/firebase";
import Button from "../Functions/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import no_dp from "../Assets/no dp.jpeg"
import { useLogout } from "../Functions/useLogout";

const Profile = () => {
  const logOut = useLogout();

  let navigate = useNavigate();

  const userRef = useRef('');

  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");


  const [User, setUser] = useState({
    id: docId,
    displayPicture: userRef.imageUrl,
    first: "",
    last: "",
    dob: "",
    gender: "",
    city: "",
    phoneNumber: "",
    email: userRef.userEmail,
    CreateProfile: "CREATE PROFILE",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    const phoneRegex = /^\d{11}$/;

    if (name === 'phoneNumber' && !phoneRegex.test(value)) {
      setError("Should be 11 digits");
    } else {
      setError("")
    };

    if (name === 'first' | 'last' && value === "") {
      setError("first name or last name should be enter");
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };



  useEffect(() => {
    const auth = getAuth();
    const userAuthentication = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("user id:", uid);
        userRef.userEmail = user.email;


        if (!user.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // window.alert("Email verification sent!");
              toast.error("Kindly verify your email first!", {
                position: "top-center",
              });
              navigate("/login");
            })
            .catch((error) => {
              // An error happened.
              console.log(error);
            });
        }
        else {
          toast.success("successfully logged in", {
            position: "top-center",
          });
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            if (doc.data().email === userRef.userEmail) {
              setProfileImage(doc.data().displayPicture);
              setDocId(doc.id);
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
    });

    return () => userAuthentication();
  }, [navigate]);



  const createProfile = async () => {
    uploadPicture();

    if (User.CreateProfile === "UPDATE PROFILE" && docId) {
      try {
        await deleteDoc(doc(db, "users", docId));
        console.log(docId, "deleted successfully!")
      }
      catch (e) {
        console.error("Error deleting document: ", e);
      }
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: User.email || userRef.userEmail,
        displayPicture: userRef.imageUrl || profileImage || "",
        first: User.first,
        last: User.last,
        dob: User.dob,
        gender: User.gender,
        city: User.city,
        phoneNumber: User.phoneNumber,
        CreateProfile: "UPDATE PROFILE"
      });
      if (error) {
        setError("Phone number should be 11 digits");
      } else {
        console.log("Document written with ID: ", docRef.id);
        userupdateProfile();
        User.CreateProfile = "UPDATE PROFILE"
        setDocId(docRef.id);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
  };


  function uploadPicture() {
    var dp = document.getElementById("upload").files[0];

    if (dp !== undefined && uploadFileRef) {
      console.log("UPLOAD FUNCTION CALL")
      const dpRef = ref(storage, `${dp.name}`);

      // 'file' comes from the Blob or File API
      if (dpRef !== "")
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
            console.log(blob);
          };
          xhr.open('GET', url);
          xhr.send();

          // Or inserted into an <img> element
          const img = document.getElementById('previewPicture');
          img.setAttribute('src', url);
          userRef.imageUrl = url;

        })
        .catch((error) => {
          // Handle any errors
        });
    }
  };

  const [selectedFile, setSelectedFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const defaultImage = no_dp;
  const uploadFileRef = useRef("");

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile();

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const ImagetoShow = imagePreview || profileImage || defaultImage;


  const uploadFile = () => {
    if (uploadFileRef) {
      uploadFileRef.current.click();
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
                  <img id="previewPicture" class="rounded-circle" src={ImagetoShow} alt="dp" onChange={handleChangeFile} />
                  <Button
                    value="UPLOAD"
                    class="btn btn-info"
                    onClick={() => uploadFile()}
                  ></Button>
                  <input
                    type="file"
                    name="upload"
                    id="upload"
                    ref={uploadFileRef}
                    accept=".jpeg, .jpg"
                    style={{ display: "none" }}
                    onChange={handleChangeFile}
                  />
                  {selectedFile && <p>Selected Picture: {selectedFile.name}</p>}
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
                {error ? <div style={{ backgroundColor: "red" }}>{error}</div> : ""}

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
                {error ? <div style={{ backgroundColor: "red" }}>{error.lastnameerror}</div> : ""}

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
                {error ? <div style={{ backgroundColor: "red" }}>{error}</div> : ""}
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

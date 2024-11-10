import { React, useState, useEffect, useRef, } from "react";
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
import Picture from "../Assets/i-yourproject.jpg";
import { toast } from "react-toastify";
import Loader from "react-js-loader";
import "./AddProject.css"



const AddProject = () => {

  let navigate = useNavigate();
  const ProjectRef = useRef('');
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [Project, setProject] = useState({
    id: docId,
    projectPicture: ProjectRef.imageUrl,
    projectTitle: "",
    desc: "",
    projectFile: "",
    createProject: "CREATE PROJECT",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'projectTitle' | 'desc' && value === "") {
      setError("projectTitle name or desc name should be enter");
    }

    setProject((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    setLoading(true);
    const auth = getAuth();
    const userAuthentication = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("user id:", uid);
        ProjectRef.userEmail = user.email;

          const querySnapshot = await getDocs(collection(db, "Projects"));
          querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            if (doc.data().email === ProjectRef.userEmail) {
              setProjectImage(doc.data().projectPicture);
              setDocId(doc.id);
              // document.getElementById('title').textContent = "UPDATE Project"
              setProject(doc.data());
              setLoading(false);
            }
          });
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


  const createProject = async () => {
    uploadProjectPicture();
    uploadProjectFile();

    if (Project.createProject === "UPDATE PROJECT" && docId) {
      try {
        await deleteDoc(doc(db, "Projects", docId));
        console.log(docId, "deleted successfully!")
      }
      catch (e) {
        console.error("Error deleting document: ", e);
      }
    }

    try {
      const docRef = await addDoc(collection(db, "Projects"), {
        email: Project.email || ProjectRef.userEmail,
        projectPicture: ProjectRef.imageUrl || ProjectImage || "",
        projectTitle: Project.projectTitle,
        desc: Project.desc,
        projectFile: Project.projectFile,
        createProject: "UPDATE PROJECT"
      });
      if (error) {
        setError("Phone number should be 11 digits");
      } else {
        console.log("Document written with ID: ", docRef.id);
        updateProject();
        Project.createProject = "UPDATE PROJECT"
        setDocId(docRef.id);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateProject = async () => {
    console.log("Update Project Call");

    if (Project.createProject === "UPDATE PROJECT") {
      toast.success("PROJECT UPDATED!", {
        position: "top-center",
      });
    } else {
      toast.success("PROJECT CREATED!", {
        position: "top-center",
      });
    }
  };


  function uploadProjectPicture() {
    var projectPicture = document.getElementById("upload").files[0];

    if (projectPicture !== undefined && uploadFileRef) {
      console.log("UPLOAD FUNCTION CALL")
      const projectPictureRef = ref(storage, `${projectPicture.name}`);

      // 'file' comes from the Blob or File API
      // if (projectPictureRef !== "")
      uploadBytes(projectPictureRef, projectPicture).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        toast.success("Project Picture Uploaded!", {
          position: "top-center",
        });
      });

      const uploadTask = uploadBytesResumable(projectPictureRef, projectPicture);


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

      getDownloadURL(ref(storage, `${projectPicture.name}`))
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
          ProjectRef.imageUrl = url;

        })
        .catch((error) => {
          // Handle any errors
        });
    }
  };


  function uploadProjectFile() {
    var projectFile = document.getElementById("projectFile").files[0];

    if (projectFile !== undefined && uploadFileRef) {
      console.log("UPLOAD FUNCTION CALL")
      const projectFileRef = ref(storage, `${projectFile.name}`);

      // 'file' comes from the Blob or File API
      // if (projectFileRef !== "")
      uploadBytes(projectFileRef, projectFile).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        toast.success("Project File Uploaded!", {
          position: "top-center",
        });
      });

      const uploadTask = uploadBytesResumable(projectFileRef, projectFile);


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

      getDownloadURL(ref(storage, `${projectFile.name}`))
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
          ProjectRef.imageUrl = url;

        })
        .catch((error) => {
          // Handle any errors
        });
    }
  };

  const [selectedFile, setSelectedFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [ProjectImage, setProjectImage] = useState("");

  const defaultImage = Picture;
  const uploadFileRef = useRef("");

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile();

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const ImagetoShow = imagePreview || ProjectImage || defaultImage;


  const uploadFile = () => {
    if (uploadFileRef) {
      uploadFileRef.current.click();
    }
  };
  const title = Project.email ? "UPDATE PROJECT" : "ADD PROJECT";
  return (
    <div>
      <div className="addproject">
        {loading && <div className="loader"> <Loader type="spinner-cub" bgColor="grey" color="black" title={"loading..."} size={100} /> </div>}

        {!loading && <table>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th colSpan={2}> <label id="title">  {title} </label></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div id="dp" style={{ textAlign: "center" }} >
                  <img id="previewPicture" class="rectangle" src={ImagetoShow} alt="dp" onChange={handleChangeFile} />
                  <Button
                    value="SELECT YOUR PROJECT IMAGE"
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
              <td>Project Title</td>
              <td>
                <input
                  type="text"
                  name="projectTitle"
                  id="projectTitle"
                  placeholder="Enter your Project Title"
                  value={Project.projectTitle}
                  onChange={handleChange}
                  required
                />
                {error ? <div style={{ backgroundColor: "red" }}>{error}</div> : ""}

              </td>
            </tr>
            <tr>
              <td>Description</td>
              <td>
                <textarea
                  type="text-area"
                  name="desc"
                  id="desc"
                  value={Project.desc}
                  placeholder="Description"
                  style={{width: "100%"}}
                  onChange={handleChange}
                  required
                />
                {error ? <div style={{ backgroundColor: "red" }}>{error.descnameerror}</div> : ""}

              </td>
            </tr>
            <tr>
              <td>
                Add Project
              </td>
              <td>
                <input type="file" id="projectFile" name="projectFile" onChange={handleChange}/>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                <Button

                  value={Project.createProject}
                  // value="CREATE Project"
                  id="create-project-btn"
                  onClick={createProject}
                  class="btn btn-success"
                ></Button>
              </td>
            </tr>
          </tfoot>
        </table>}
      </div>
    </div>
  );
}

export default AddProject;

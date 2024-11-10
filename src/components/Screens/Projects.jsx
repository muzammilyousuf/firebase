import React, { useEffect, useState } from "react";
import Card from "../Functions/Card";
import Picture from "../Assets/i-yourproject.jpg";
import "./Contact.css";
import "./Home.css";
import {
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  onAuthStateChanged,
  auth
} from "../config/firebase";
import Button from "../Functions/Button";
import "./Projects.css";
import { toast } from "react-toastify";
import { useRef } from "react";
// import { Modal } from "react-bootstrap";
import Modal from "react-modal";
import AddProject from "./AddProject";

function Projects() {
  // Modal.setAppElement("#root");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedFile, setSelectedFile] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // {selectedFile
      //   // &&
      //   // addProjects();
      // }
    }
  };

  const inputRef = useRef("");

  function add() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const projects = [{ id: "", title: "", desc: "", image: "", file: "" }];

  const listProjects = projects.map((projects) => (
    <li key={projects.id}>
      {" "}
      {projects.title} {projects.desc} {projects.image} {projects.file}{" "}
    </li>
  ));

  // const [projectUrl, setProjectUrl] = useState("");

  // function addProjects() {
  //   var project = selectedFile;

  //   const projectRef = ref(storage, `${project.name}.jpg`);
  //   uploadBytes(projectRef, project).then((snapshot) => {
  //     console.log("Uploaded a blob or file!");
  //     toast.success("Display Picture Uploaded!", {
  //       position: "top-center",
  //     });
  //   });

  //   const uploadTask = uploadBytesResumable(projectRef, project);

  //   // Register three observers:
  //   // 1. 'state_changed' observer, called any time the state changes
  //   // 2. Error observer, called on failure
  //   // 3. Completion observer, called on successful completion
  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       // Observe state change events such as progress, pause, and resume
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       const progress =
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is " + progress + "% done");
  //       switch (snapshot.state) {
  //         case "paused":
  //           console.log("Upload is paused");
  //           break;
  //         case "running":
  //           console.log("Upload is running");
  //           break;
  //       }
  //     },
  //     (error) => {
  //       // Handle unsuccessful uploads
  //     },
  //     () => {
  //       // Handle successful uploads on complete
  //       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log("File available at", downloadURL);
  //         toast.success("Project Uploaded!", {
  //           position: "top-center",
  //         });

  //         setProjectUrl(downloadURL);
  //       });
  //     }
  //   );
  // }

  const ProjectRef = useRef("");

  useEffect(() => {
    const fetchProjectPicture = onAuthStateChanged(auth, async (user) => {
      if (user) {
        getDownloadURL(ref(storage, `projectPicture.name`))
          .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = (event) => {
              const blob = xhr.response;
              console.log(blob);
            };
            xhr.open("GET", url);
            xhr.send();

            // Or inserted into an <img> element
            const img = document.getElementById("previewPicture");
            img.setAttribute("src", url);
            ProjectRef.imageUrl = url;
          })
          .catch((error) => {
            // Handle any errors
          });
      }
    });

    return () => fetchProjectPicture();
  }, []);

  let defaultPicture = Picture;

  const imagetoshow = ProjectRef.imageUrl || defaultPicture;

  return (
    <div className="projects">
      <th>PROJECTS</th>
      <h2 style={{ textAlign: "center" }}>
        To elaborate your skills publicly, add your project here!{" "}
      </h2>
      <br />
      <div>
        <div className="project-btns">
          {/* <input type="file" class="btn btn-success" id="addButton"  /> */}
          <Button value="ADD FILE" class="btn btn-success" onClick={add} />
          <input
            type="file"
            name="addBtn"
            id="addBtn"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
          {/* {selectedFile && <p>Uploaded File: {selectedFile.name}</p>} */}
          <Button
            value="ADD PROJECT"
            class="btn btn-success"
            onClick={() => openModal()}
          />
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            ariaHideApp={false}
          >
            <div className="Modal" style={{ height: "100vh" }}>
              <button
                onClick={closeModal}
                style={{ backgroundColor: "red" }}
                class="rounded-circle"
              >
                x
              </button>
              <AddProject />
            </div>
          </Modal>

          <Button value="DELETE PROJECT" class="btn btn-success" />
          <Button
            value="SEARCH PROJECT"
            class="btn btn-success"
            type="search"
          />
        </div>

        <div className="cards">
          <Card
            src={imagetoshow}
            title={listProjects}
            desc={"Description here !"}
            // btnhref={projectUrl}
          />
          <Card src={Picture} />
          <Card src={Picture} />
          <Card src={Picture} />
        </div>
      </div>
    </div>
  );
}

export default Projects;

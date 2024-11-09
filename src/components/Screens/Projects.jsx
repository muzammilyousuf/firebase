import React, { useState } from "react";
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
} from "../config/firebase";
import Button from "../Functions/Button";
import "./Projects.css";
import { toast } from "react-toastify";
import { useRef } from "react";

function Projects() {
  // function uploadFiles() {
  //   const storageRef = ref(storage, 'some-child');
  //   var file = document.getElementById("uploadBtn").files[0];
  //   uploadBytes(storageRef, file).then((snapshot) => {
  //     console.log('Uploaded a blob or file!');
  //   });
  // };

  const valueRef = useRef("");

  function addProjects() {
    var projects = document.getElementById("addBtn").files[0];
    // console.log(projects)

    console.log("ADD PROJECT FUNCTION CALL");
    const projectsRef = ref(storage, `${projects.name}`);

    // 'file' comes from the Blob or File API
    if (projectsRef !== "")
      uploadBytes(projectsRef, projects).then((snapshot) => {
        console.log("Uploaded a blob or file!");
        toast.success("Project Uploaded!", {
          position: "top-center",
        });
      });

    const uploadTask = uploadBytesResumable(projectsRef, projects);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");

            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );

    getDownloadURL(ref(storage, `${projects.name}`))
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
        valueRef.imageUrl = url;
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  const [selectedFile, setSelectedFile] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      addProjects();
    }
  };

  const inputRef = useRef("");

  function add() {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const projects = [{ id: "", title: "", desc: "", image:"", file: "" }];

  const listProjects = projects.map((projects) => (
    <li key={projects.id}> {projects.title} {projects.desc} {projects.image} {projects.file} </li>
  ));

  return (
    <div className="projects">
      <th>PROJECTS</th>
      <h2 style={{ textAlign: "center" }}>
        To elaborate showcase your skills publicly, add your project here!{" "}
      </h2>
      <div>
        <div className="project-btns">
          {/* <input type="file" class="btn btn-success" id="addButton"  /> */}
          <Button value="ADD PROJECT" class="btn btn-success" onClick={add} />
          <input
            type="file"
            name="addBtn"
            id="addBtn"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
          {selectedFile && <p>Selected File: {selectedFile.name}</p>}
          <Button value="DELETE PROJECT" class="btn btn-success" />
          <Button value="EDIT PROJECT" class="btn btn-success" />
          <Button value="SEARCH PROJECT" class="btn btn-success" />
        </div>

        <div className="cards">
          <Card
            src={Picture}
            title={listProjects}
            desc={"Description here !"}
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

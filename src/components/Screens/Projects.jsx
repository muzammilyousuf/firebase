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

  
  
  const [selectedFile, setSelectedFile] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // addProjects();
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

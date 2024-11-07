import React from "react";
import Card from "../Functions/Card";
import Picture from "../Assets/i-yourproject.jpg";
import "./Contact.css";
import "./Home.css";
import { storage, ref, uploadBytes } from "../config/firebase";
import Button from "../Functions/Button";
import "./Projects.css";

function Projects() {
  // function uploadFiles() {
  //   const storageRef = ref(storage, 'some-child');
  //   var file = document.getElementById("uploadBtn").files[0];
  //   uploadBytes(storageRef, file).then((snapshot) => {
  //     console.log('Uploaded a blob or file!');
  //   });
  // };

  function addProjects() {}

  return (
    <div className="projects">
      <th>PROJECTS</th>
      <div>
        <div className="project-btns">
          <Button value="ADD PROJECT" class="btn btn-success" />
          <Button value="DELETE PROJECT" class="btn btn-success" />
          <Button value="EDIT PROJECT" class="btn btn-success" />
          <Button value="SEARCH PROJECT" class="btn btn-success" />
        </div>

        <div className="cards">
          <Card src={Picture} title={"TITLE"} desc={"Description here !"} />
          <Card src={Picture} />
          <Card src={Picture} />
          <Card src={Picture} />
        </div>
      </div>
    </div>
  );
}

export default Projects;

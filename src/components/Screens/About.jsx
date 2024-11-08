import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about">
      <th>ABOUT</th>

      <div className="heading-1">
        <h1>The Project:</h1>
        <p>
          The application allows Desk Skills students to sign up, publish their
          projects, and share them with the public. It serves as an online
          portfolio, enabling students to showcase their work and build a
          presence within the community. The goal is to provide a platform where
          students can present their technical abilities, collaborate with
          others, and receive recognition for their efforts.
        </p>
      </div>

      <div className="heading-2">
        <h1>About Me:</h1>
        <p>
          My name is Muzammil Yousuf, and I am currently learning React JS
          through a course at Desk Skills, located in Cantonment Shopping Mall
          near Millennium Mall, Karachi. During this course, I developed this
          project specifically designed for the students of Desk Skills to help
          them highlight their technical skills.
        </p>
      </div>
    </div>
  );
}

export default About;

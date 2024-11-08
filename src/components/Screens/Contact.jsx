import React from "react";
import logo from "../logo.svg";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact">
        <h1> CONTACT </h1>
      <div>
        <header className="Contact-header">
          <img src={logo} className="Contact-logo" alt="logo" />

          <a
            className="Contact-link"
            href="/"
            // href="https://react-ive.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React-ive
          </a>
        </header>
      </div>
      <div>
        <table>
          <thead>
            <tr>{/* <th colSpan={2}>CONTACT</th> */}</tr>
          </thead>
          <tbody>
            <tr>
              <td>LINKEDIN: </td>
              <td>
                <a href="https://linkedin.com/in/muzammil-yousuf">
                  {" "}
                  /muzammil-yousuf
                </a>
              </td>
            </tr>
            <tr>
              <td>GITHUB: </td>
              <td>
                <a href="https://github.com/muzammilyousuf"> /muzammilyousuf</a>
              </td>
            </tr>

            <tr>
              <td>YOUTUBE: </td>
              <td>
                <a href="https://www.youtube.com/@sahilrajputsr9">
                  {" "}
                  L_EARN WITH SAHIL
                </a>
              </td>
            </tr>
            <tr>
              <td>EMAIL: </td>
              <td>
                <a href="mailto:muzammilyousuf001@gmail.com">
                  muzammilyousuf001@gmail.com
                </a>
              </td>
            </tr>
            <tr>
              <td>PHONE: </td>
              <td>
                <a href="tel:+923111254156"> +923111254156</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contact;

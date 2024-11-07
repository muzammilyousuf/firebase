import React from "react";
import Card from "../Functions/Card";
import Picture from "../Assets/8191JLvpswL.jpg";
import backgroundImage from "../Assets/74112617-d6741a00-4b63-11ea-9757-81c55fe8e9b5.gif";
import "./Contact.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  function ContactBtn() {
    navigate("/contact");
  }

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  return (
    <div className="home">
      <div className="display">
        <p style={backgroundImageStyle}>
          <h4 > "Hi, this is </h4>
          <h1> REACT-IVE </h1>
          <h4> by Muzammil" </h4>
          <input type="button" value="Contact me" class="btn btn-info" onClick={ContactBtn} />
        </p>
      </div>
      {/* <div className="footer">
        <p></p>
      </div> */}
    </div>
  );
}

export default Home;

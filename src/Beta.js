import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import emailjs from "@emailjs/browser";

import "./Beta.css";
import "./App.css";

import Footer from "./Footer";

import fullLogo from "./img/fullLogo.png";
import greenCheck from "./img/check.png";
import arrow1 from "./img/sideArrowRight.png";
import arrow2 from "./img/rightArrow.png";

function Beta() {
  // document.title = "comparify | Beta";
  const [emails, setEmails] = useState(["", "", "", "", ""]);
  const [emailValidity, setEmailValidity] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);

    const updatedEmailValidity = [...emailValidity];
    updatedEmailValidity[index] =
      index === 0
        ? validateEmail(value)
        : value.trim() === "" || validateEmail(value);
    setEmailValidity(updatedEmailValidity);

    const isDuplicate = emails.some(
      (email, i) => email !== "" && index !== i && email === value
    );
    if (isDuplicate) {
      e.target.classList.remove("valid");
    } else {
      e.target.classList.add("valid");
    }
  };

  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    // Check for duplicates
    const duplicateEmails = emails.filter(
      (email, index) => email !== "" && emails.indexOf(email) !== index
    );

    // Check for invalid emails
    const isInvalidEmails = emails.some(
      (email, index) => email.trim() !== "" && !emailValidity[index]
    );

    // Check if all inputs are blank
    const allInputsBlank = emails.every((email) => email.trim() === "");

    return !duplicateEmails.length && !isInvalidEmails && !allInputsBlank;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for duplicate emails
    const duplicateEmails = emails.filter(
      (email, index) => email !== "" && emails.indexOf(email) !== index
    );
    if (duplicateEmails.length > 0) {
      const updatedEmailValidity = emailValidity.map((validity, index) => {
        return !duplicateEmails.includes(emails[index]);
      });
      setEmailValidity(updatedEmailValidity);
      return;
    }

    const isEmailsValid = emailValidity.every((validity) => validity);

    if (isEmailsValid) {
      console.log(emails);
      // sendEmail(emails);
      setSubmitted(true);

      setEmails(["", "", "", "", ""]);
      setTimeout(() => {
        form.current.reset();
        setSubmitted(false);
        setEmailValidity([true, true, true, true, true]);
      }, 3000);
    } else {
      const firstInvalidIndex = emailValidity.findIndex(
        (validity) => !validity
      );
      const firstInvalidInput = document.getElementById(
        `email-input-${firstInvalidIndex}`
      );
      firstInvalidInput.focus();
    }
  };

  const form = useRef();

  const sendEmail = (emails) => {
    const emailObject = emails.reduce((obj, email, index) => {
      obj[`email${index + 1}`] = email;
      return obj;
    }, {});

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        emailObject,
        process.env.REACT_APP_EMAILJS_KEY,
       
       
        
      )
      .then(
        (result) => {},
        (error) => {}
      );
  };
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);

    const handleDarkModeChange = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };

    window.addEventListener("darkModeChanged", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChanged", handleDarkModeChange);
    };
  }, []);

  return (
    <div className={darkMode && "dark"} style={{height:'100vh'}}>
      <img
        className="logoHeader"
        src={fullLogo}
        onClick={() => navigate("/")}
        title="Home"
        alt="Logo"
        style={{
          width: "175px" ,
          position: "absolute",
          top: "10px",
          left: "10px",
          pointerEvents: "all",
          cursor: "pointer",
          backgroundColor:'white',
          padding:'4px',
          boxShadow:' 0 2px 10px rgba(0, 0, 0, 0.3)',
          borderRadius:'20px'

        }}
      />

      <div className="" style={{ overflow: "hidden" }}>
        <div className="title">
          <div className="beta">beta access</div>
          <div className="info">
            <img src={arrow1} className="arrow" alt="Arrow"></img>
            enter up to five emails (you + family + friends)
            <br /> <br />
            <img src={arrow1} className="arrow" alt="Arrow"></img>
            make sure they match their Spotify accounts
            <br /> <br />
            <img src={arrow1} className="arrow" alt="Arrow"></img>
            we add users in groups so you can try with people you know
            <br /> <br />
            <img src={arrow1} className="arrow" alt="Arrow"></img>
            we will contact the group when it has access
          </div>
        </div>
      </div>

      <div className="emailFormContainer">
        <form
          ref={form}
          className={darkMode ? "emailForm dark" : "emailForm"}
          onSubmit={handleSubmit}
          title="Submit"
        >
          {emails.map((email, index) => (
            <div key={index} className="emailInput">
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange(e, index)}
                className={emailValidity[index] ? "" : "invalidEmail"}
                id={`emailInput-${index}`}
                autoComplete="new-password"
              />
            </div>
          ))}

          {!submitted ? (
            <div>
              <button
                type="submit"
                className={
                  !isFormValid() ? "submitFormBtn disabled" : "submitFormBtn"
                }
                disabled={!isFormValid()}
              >
                submit{" "}
                <img src={arrow2} className="submitArrow" alt="Submit arrow" />
              </button>
            </div>
          ) : (
            
            <div style={{marginTop: '40px'}}>
            <span className="submitted">
            
              <img src={greenCheck} alt="Green check" />
              <span> Submitted!</span> Notifications will be sent when access
              becomes available.
            </span>
            </div>
          )}
        </form>
      </div>
      <span className="gray" onClick={() => navigate("/")} title="Home">
        <img src={arrow2} alt="homeArrow" className="homeArrow" /> home
      </span>

      {/* <Footer /> */}
    </div>
  );
}

export default Beta;

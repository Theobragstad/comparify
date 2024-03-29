import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  // const handleChange = (e, index) => {
  //   const { value } = e.target;
  //   const updatedEmails = [...emails];
  //   updatedEmails[index] = value;
  //   setEmails(updatedEmails);

  //   const updatedEmailValidity = [...emailValidity];
  //   updatedEmailValidity[index] =
  //     index === 0
  //       ? validateEmail(value)
  //       : value.trim() === "" || validateEmail(value);
  //   setEmailValidity(updatedEmailValidity);

  //   const isDuplicate = emails.some(
  //     (email, i) => email !== "" && index !== i && email === value
  //   );
  //   if (isDuplicate) {
  //     e.target.classList.remove("valid");
  //   } else {
  //     e.target.classList.add("valid");
  //   }
  // };
  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);

    const updatedEmailValidity = [...emailValidity];
    updatedEmailValidity[index] = value.trim() === "" || validateEmail(value);
    setEmailValidity(updatedEmailValidity);

    const emailOccurrences = updatedEmails.reduce((occurrences, email) => {
      occurrences[email] = (occurrences[email] || 0) + 1;
      return occurrences;
    }, {});

    updatedEmails.forEach((email, i) => {
      const inputElement = document.getElementById(`emailInput-${i}`);
      if (inputElement) {
        const isDuplicate = emailOccurrences[email] > 1;
        const isValidFormat = validateEmail(email);

        if (email.trim() !== "") {
          if (isDuplicate || !isValidFormat) {
            inputElement.classList.remove("valid");
            inputElement.classList.add("invalidEmail");
          } else {
            inputElement.classList.remove("invalidEmail");
            inputElement.classList.add("valid");
          }
        } else {
          // Reset classes for empty fields
          inputElement.classList.remove("invalidEmail");
          inputElement.classList.remove("valid");
        }
      }
    });
  };

  const validateEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
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
      sendEmail(emails);
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
        process.env.REACT_APP_EMAILJS_KEY
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
    <div
      className={darkMode && "dark"}
      style={{ height: "100vh", fontFamily: "gothamMedium" }}
    >
      <Link to="/">
        <img
          draggable={false}
          alt=""
          src={fullLogo}
          style={{
            width: "175px",
            position: "absolute",
            top: "10px",
            left: "10px",
            
            padding: "4px",
            borderRadius: "20px",
            webkitUserDrag: "none",
          }}
          onContextMenu={(event) => event.preventDefault()}
        />
      </Link>

      <div className="" style={{ overflow: "hidden" }}>
        <div className="title">
          <div className="beta">waitlist</div>
          <div className="info">
            <span className="info1">
            <span style={{ fontSize: "20px" }}>1. </span>
            enter up to 5 emails (you + family + friends)
            <br /> <br />
            </span>

            <span className="info2">
            <span style={{ fontSize: "20px" }}>2. </span>
            make sure the emails match each person's Spotify account login
            <br /> <br />
            </span>

            <span className="info3">
            <span style={{ fontSize: "20px" }}>3. </span>
            users will be added in these groups so everyone can try together
            <br /> <br />
            </span>

            <span className="info4">
            <span style={{ fontSize: "20px" }}>4. </span>
            we will contact the group when it has access
            </span>
          </div>
        </div>
      </div>

      <div className="emailFormContainer">
        <form
          ref={form}
          className={darkMode ? "emailForm dark" : "emailForm"}
          onSubmit={handleSubmit}
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
                  !isFormValid()
                    ? "submitFormBtn disabled padded"
                    : "submitFormBtn padded"
                }
                disabled={!isFormValid()}
              >
                submit{" "}
                <img
                  draggable={false}
                  src={arrow2}
                  className="submitArrow"
                  alt="Submit arrow"
                  onContextMenu={(event) => event.preventDefault()}
                />
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "40px" }}>
              <span className="submitted">
                <img
                  draggable={false}
                  src={greenCheck}
                  alt="Green check"
                  onContextMenu={(event) => event.preventDefault()}
                />
                <span> Submitted!</span> Notifications will be sent when access
                becomes available.
              </span>
            </div>
          )}
        </form>
      </div>
      {/* <span className="gray padded" onClick={() => navigate("/")} >
        <img
          draggable={false}
          src={arrow2}
          alt="homeArrow"
          className="homeArrow"
          onContextMenu={(event) => event.preventDefault()}
        />{" "}
        home
      </span> */}
<div style={{marginTop:'29px'}}>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Beta;

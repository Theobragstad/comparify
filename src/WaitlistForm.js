import React, { useEffect, useState, useRef, useContext } from "react";
import emailjs from "@emailjs/browser";

import "./Form.css";
import "./App.css";

import logo from "./img/logo.png";
import check from "./img/check.png";
import logoAlt from "./img/logoAlt.png";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import sideArrowRight from "./img/sideArrowRight.png";


// import { DarkModeContext } from './App';
import { useDarkMode } from "./DarkMode";

function WaitlistForm() {
  document.title = "comparify - Beta";
const darkMode = useDarkMode()

  // const { darkMode, setDarkMode } = useContext(DarkModeContext);

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
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const isFormValid =
  emails.some((email, index) => email.trim() !== "" && emailValidity[index]) &&
  !emails.some(
    (email, index) =>
      email.trim() !== "" &&
      emails.indexOf(email) !== index &&
      emailValidity[index]
  );


  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one email input is non-empty
    // const hasNonEmptyEmail = emails.some((email) => email.trim() !== "");
    // if (!hasNonEmptyEmail) {
    //   // Focus on the first email input
    //   const firstEmailInput = document.getElementById(`email-input-0`);
    //   firstEmailInput.focus();
    //   return;
    // }

    // Check for duplicate emails
    const isDuplicate = emails.some(
      (email, index) => email !== "" && emails.indexOf(email) !== index
    );
    if (isDuplicate) {
      const updatedEmailValidity = emailValidity.map((validity, index) => {
        if (emails.indexOf(emails[index]) !== index) {
          return false;
        }
        return validity;
      });
      setEmailValidity(updatedEmailValidity);
      return;
    }

    // Check if all email inputs are valid
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
      // Focus on the first invalid email input
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
        "service_6sehby6",
        "template_5zxl5ze",
        emailObject,
        "hpyZw_CcV3bioW9ke"
      )
      .then(
        (result) => {
          // show the user a success message
        },
        (error) => {
          // show the user an error
        }
      );
  };
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    // <>
        <div className={darkMode.darkModeOn ? "fullPageContainer dark": "fullPageContainer"} >

    {/* <div className={darkMode ? "dark" : ""}></div> */}
      <h1 className="logoName">comparify</h1>
      <button title="Back" className="defaultBtn" onClick={() => navigate("/")}>
        <img
          src={logo}
          className="appLogo"
          alt="logo"
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            width: "60px",
            pointerEvents: "all",
          }}
        />
      </button>

      <div className="containerMain">
        {/* <Link to="/eeee"> */}

        {/* </Link> */}

        <div className="title">
          <div className="">
            <div
              className="gray nohover"
              style={{
                width: "fit-content",
                margin: "10px auto",
                cursor: "auto",
              }}
            >
              get access
            </div>
            <br />
            <div
              style={{
                border: "none",
                borderRadius: "10px",
                cursor: "auto",
                backgroundColor: "white",
                fontWeight: "bold",
                color: "gray",
                padding: "10px 10px 10px 0px",
                textAlign: "left",
                fontSize: "14px",
              }}
              className={darkMode.darkModeOn && "dark2"}
            >
              <span
                className="gray nohover"
                style={{ color: "black", cursor: "auto" }}
              >
                <img src={sideArrowRight} style={{ width: "8px" }}></img>
              </span>{" "}
              enter up to five emails (you + family + friends)
              <br /> <br />
              <span
                className="gray nohover"
                style={{ color: "black", cursor: "auto" }}
              >
                <img src={sideArrowRight} style={{ width: "8px" }}></img>
              </span>{" "}
              make sure the emails match their Spotify accounts
              <br /> <br />
              <span
                className="gray nohover"
                style={{ color: "black", cursor: "auto" }}
              >
                <img src={sideArrowRight} style={{ width: "8px" }}></img>
              </span>{" "}
              we add users in groups so you can try with people you know
              <br /> <br />
              <span
                className="gray nohover"
                style={{ color: "black", cursor: "auto" }}
              >
                <img src={sideArrowRight} style={{ width: "8px" }}></img>
              </span>{" "}
              we will contact the group when it has access
            </div>
          </div>
        </div>
        <div className="email-form-container bottom">
          <form ref={form} className={darkMode.darkModeOn ? "email-form darkGray":"email-form"}  onSubmit={handleSubmit}>
            {emails.map((email, index) => (
              <div key={index} className="email-input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange(e, index)}
                  className={emailValidity[index] ? "" : "invalid-email"}
                  id={`email-input-${index}`} // Add unique IDs to each input
                  autoComplete="new-password"
                />
              </div>
            ))}
            
            {!submitted ? (
              <div style={{ marginTop: "30px" }}>
                {" "}
                <div
                  type="submit"
                  className={
                    !isFormValid ? "defaultBtnForm disabled" : "defaultBtnForm"
                  }
                  style={{ width: "fit-content", margin: "0 auto " }}
                  onClick={handleSubmit}
                >
                  submit &#8594;
                </div>
              </div>
              
         
            ) : (
              <span className="submitted">
                <br />
                <img src={check} style={{ width: "15px" }} />
                <span style={{ color: "#18d860" }}> Submitted!</span>{" "}
                Notifications will be sent when access becomes available.
              </span>
            )}
          </form>
          
        </div>
        <span
          className="gray"
          style={{ marginTop: "40px" }}
          onClick={()=>navigate("/")}
        >
          &#8592; home 
        </span>
      </div>
      <Footer />
      </div>
    /* </> */
  );
}

export default WaitlistForm;

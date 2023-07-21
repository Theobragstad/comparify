import React, { useState, useRef } from "react";
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
  document.title = "comparify - Beta Access";

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
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const isFormValid =
    emails.some(
      (email, index) => email.trim() !== "" && emailValidity[index]
    ) &&
    !emails.some(
      (email, index) =>
        email.trim() !== "" &&
        emails.indexOf(email) !== index &&
        emailValidity[index]
    );

  const handleSubmit = (e) => {
    e.preventDefault();

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
        `emailInput${firstInvalidIndex}`
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
        (result) => {},
        (error) => {}
      );
  };
  const navigate = useNavigate();

  return (
    <div>
      <img
        className="logoHeader"
        src={fullLogo}
        onClick={() => navigate("/")}
        title="Home"
        alt="Logo"
      />

      <div className="">
        <div className="title">
          <div className="beta">beta access</div>
          <div className="info">
            <img
              src={arrow1}
              className="arrow"
              
              alt="Arrow"
            ></img>
            enter up to five emails (you + family + friends)
            <br /> <br />
            <img
              src={arrow1}
              className="arrow"
              alt="Arrow"
            ></img>
            make sure they match their Spotify accounts
            <br /> <br />
            <img
              src={arrow1}
              className="arrow"
              alt="Arrow"
            ></img>
            we add users in groups so you can try with people you know
            <br /> <br />
            <img
              src={arrow1}
              className="arrow"
              alt="Arrow"
            ></img>
            we will contact the group when it has access
          </div>
        </div>
      </div>


      <div className="emailFormContainer">
          <form
            ref={form}
            className="email-form"
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
                  id={`email-input-${index}`}
                  autoComplete="new-password"
                />
              </div>
            ))}

            {!submitted ? (
              <div >
                {" "}
                <div
                  type="submit"
                  className={
                    !isFormValid ? "defaultBtnForm disabled" : "defaultBtnForm"
                  }
                  // style={{ width: "fit-content", margin: "0 auto " }}
                  onClick={handleSubmit}
                >
                  submit{" "}
                  {/* <img
                    src={arrow2}
                    style={{ width: "15px", verticalAlign: "middle" }}
                  /> */}
                </div>
              </div>
            ) : (
              <span className="submitted">
                {/* <img src={greenCheck} style={{ width: "15px" }} /> */}
                {/* <span style={{ color: "#18d860" }}> Submitted!</span>{" "}
                Notifications will be sent when access becomes available. */}
              </span>
            )}
          </form>
        </div>
        <span className="gray" onClick={() => navigate("/")} title="Home">
          {/* <img
            src={arrow2}
            style={{
              width: "15px",
              verticalAlign: "middle",
              transform: "rotate(180deg)",
            }}
          />{" "} */}
          home
        </span>

      <Footer />
      {/* 

      <div className="containerMain">
        <div className="title">
          <div className="">
            <div
              className="gray nohover"
              style={{
                width: "fit-content",
                margin: "0 auto",
                cursor: "auto",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              beta access
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
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              <img
                src={sideArrowRight}
                style={{ width: "8px", marginRight: "10px" }}
              ></img>
              enter up to five emails (you + family + friends)
              <br /> <br />
              <img
                src={sideArrowRight}
                style={{ width: "8px", marginRight: "10px" }}
              ></img>
              make sure they match their Spotify accounts
              <br /> <br />
              <img
                src={sideArrowRight}
                style={{ width: "8px", marginRight: "10px" }}
              ></img>
              we add users in groups so you can try with people you know
              <br /> <br />
              <img
                src={sideArrowRight}
                style={{ width: "8px", marginRight: "10px" }}
              ></img>
              we will contact the group when it has access
            </div>
          </div>
        </div>
        <div className="email-form-container">
          <form
            ref={form}
            className={
              darkMode.darkModeOn ? "email-form darkGray" : "email-form"
            }
            onSubmit={handleSubmit}
            title="Submit"
          >
            {emails.map((email, index) => (
              <div key={index} className="email-input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange(e, index)}
                  className={emailValidity[index] ? "" : "invalid-email"}
                  id={`email-input-${index}`}
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
                  submit{" "}
                  <img
                    src={rightArrow}
                    style={{ width: "15px", verticalAlign: "middle" }}
                  />
                </div>
              </div>
            ) : (
              <span className="submitted">
                <br />
                <img src={greenCheck} style={{ width: "15px" }} />
                <span style={{ color: "#18d860" }}> Submitted!</span>{" "}
                Notifications will be sent when access becomes available.
              </span>
            )}
          </form>
        </div>
        <span className="gray" onClick={() => navigate("/")} title="Home">
          <img
            src={rightArrow}
            style={{
              width: "15px",
              verticalAlign: "middle",
              transform: "rotate(180deg)",
            }}
          />{" "}
          home
        </span>
      </div>

      <Footer /> */}
    </div>
  );
}

export default Beta;

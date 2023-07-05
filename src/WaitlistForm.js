import React, { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";

import "./Form.css";
import logo from "./img/logo.png";
import check from "./img/check.png";
import logoAlt from "./img/logoAlt.png";
import { useNavigate } from "react-router-dom";

function WaitlistForm() {

    document.title = "comparify - Join the waitlist";

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
    emailValidity.every((validity) => validity) &&
    emails.some((email) => email.trim() !== "") &&
    !emails.some(
      (email, index) => emails.indexOf(email) !== index && email.trim() !== ""
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one email input is non-empty
    const hasNonEmptyEmail = emails.some((email) => email.trim() !== "");
    if (!hasNonEmptyEmail) {
      // Focus on the first email input
      const firstEmailInput = document.getElementById(`email-input-0`);
      firstEmailInput.focus();
      return;
    }

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
      }, 2500);
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
    navigate("/")
  }

  return (

    <div className="container">
        <h2 className="" style={{color:'gray'}}>waitlist signup</h2>

        <button
            title="Back"
            className="defaultBtn pulse"
            onClick={goBack}
           
          >
      <img src={logoAlt} style={{ width: "75px" }} /></button>
   

      <div className="title">
        <div className="">
          <button
            className=""
            style={{
              border: "none",
              borderRadius: "10px",
              cursor: "auto",
              backgroundColor: "#e4fae4",
              fontWeight: "bold",
              color: "#18d860",
            }}
          >
            comparify is in beta mode
          </button>
          <br />
          <button
            style={{
              border: "none",
              borderRadius: "10px",
              cursor: "auto",
              backgroundColor: "#f6f6f6",
              fontWeight: "bold",
              color: "darkgray",
              padding: "10px",
              marginTop:'10px'
            }}
          >
            enter up to five emails (you + friends + family) below and
            we will contact them when they have access. make sure the emails match their Spotify accounts (otherwise they won't be able to
            log in to their intended one).
          </button>
        </div>
      </div>
      <div className="email-form-container">
        <form ref={form} className="email-form" onSubmit={handleSubmit}>
          {emails.map((email, index) => (
            <div key={index} className="email-input">
              <input
                type="email"
                value={email}
                onChange={(e) => handleChange(e, index)}
                required={index === 0} // First input is required
                className={emailValidity[index] ? "" : "invalid-email"}
                id={`email-input-${index}`} // Add unique IDs to each input
                autocomplete="new-password"
              />
            </div>
          ))}
          {!submitted ? (
            <button
              type="submit"
              className="defaultBtnForm"
              disabled={!isFormValid}
            >
              submit
            </button>
          ) : (
            <span className="submitted">
              <br />
              <img src={check} style={{ width: "15px" }} /> Submitted.
              Notifications will be sent when access becomes available.
            </span>
          )}
        </form>
      </div>
    </div>
  );
}

export default WaitlistForm;

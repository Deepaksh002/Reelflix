import React, { useState, useEffect } from "react";
import useInput from "../CUSTOM-HOOKS/useInput";

function Signup(props) {
  const [responseMsg, setResponseMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Turn off loading after initial render
    }, 300);
  }, []);

  const {
    value: USERNAME,
    isValid: usernameIsValid,
    valueChangeHandler: usernameChangeHandler,
    clear: clearUsername,
  } = useInput((value) => value.trim().length > 5, "");

  const {
    value: EMAIL,
    isValid: emailIsValid,
    valueChangeHandler: emailChangeHandler,
    clear: clearEmail,
  } = useInput((value) => value.trim().length > 10 && value.includes("@"), "");

  const {
    value: PASSWORD,
    isValid: passwordIsValid,
    valueChangeHandler: passwordChangeHandler,
    clear: clearPassword,
  } = useInput((value) => value.trim().length >= 6, "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupData = {
      username: USERNAME,
      email: EMAIL,
      password: PASSWORD,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      const responseData = await response.json();

      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      clearEmail();
      clearPassword();
      clearUsername();
      setResponseMsg(responseData.message);
    } catch (err) {
      setResponseMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth">
      {isLoading ? (
        <h2>LOADING...</h2>
      ) : (
        <>
          <h3>CREATE A NEW ACCOUNT</h3>
          <input
            className={usernameIsValid ? "input" : "invalid"}
            type="text"
            placeholder="USERNAME"
            value={USERNAME}
            onChange={usernameChangeHandler}
          />
          <input
            className={emailIsValid ? "input" : "invalid"}
            type="text"
            placeholder="EMAIL"
            value={EMAIL}
            onChange={emailChangeHandler}
          />
          <input
            className={passwordIsValid ? "input" : "invalid"}
            type="password"
            placeholder="PASSWORD"
            value={PASSWORD}
            onChange={passwordChangeHandler}
          />
          <button className="btn">SUBMIT</button>
          <h3>{responseMsg}</h3>
        </>
      )}
    </form>
  );
}

export default Signup;

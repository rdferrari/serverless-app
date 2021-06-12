import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const FormContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 1024px) {
    margin-top: 40px;
  }
`;

const Button = styled.button`
  background-color: #88d5ba;
  color: "#272727";
  border: none;
  border-radius: 4px;
  font-family: textFontLight;
  font-size: 20px;
  margin-bottom: 10px;
  padding: 0 20px;
  width: 240px;
`;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [userNotConfirmed, setUserNotConfirmed] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [passForgot, setPassForgot] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  async function signIn(data) {
    const { username, password } = data;
    try {
      await Auth.signIn({
        username,
        password,
      });
      reset({
        username: "",
        password: "",
      });
    } catch (err) {
      setErrMessage(err.message);
      setUserNotConfirmed(data.username);
      resendCode();
    }
  }

  async function resendCode() {
    try {
      await Auth.resendSignUp(userNotConfirmed);
      console.log("code resent successfully");
    } catch (err) {
      console.log("error resending code: ", err);
    }
  }

  async function confirmUser(data) {
    const { password } = data;
    try {
      await Auth.confirmSignUp(userNotConfirmed, password);
      reset({
        password: "",
      });
      setErrMessage("");
    } catch (err) {
      console.log({ err, data });
    }
  }

  async function forgotPass(data) {
    const { username } = data;
    try {
      await Auth.forgotPassword(username);
      setShowNewPass(true);
      console.log("code resent successfully");
    } catch (err) {
      console.log("error resending code: ", err);
    }
  }

  async function newPass(data) {
    const { username, code, new_password } = data;
    try {
      await Auth.forgotPasswordSubmit(username, code, new_password);
      console.log("code resent successfully");
      setPassForgot(false);
      setShowNewPass(false);
    } catch (err) {
      console.log("error resending code: ", err);
    }
  }

  if (showNewPass === true) {
    return (
      <FormContainer>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />

        {errors.code && <p className="error-message">Username is required</p>}

        <input
          type="text"
          placeholder="Code"
          {...register("code", { required: true })}
        />
        {errors.code && <p className="error-message">Code is required</p>}

        <input
          type="Passwrod"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.code && (
          <p className="error-message">New Password is required</p>
        )}

        <Button onClick={handleSubmit(newPass)}>
          <p>New password</p>
        </Button>
      </FormContainer>
    );
  }

  if (passForgot === true) {
    return (
      <FormContainer>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.code && <p className="error-message">Email is required</p>}

        <Button onClick={handleSubmit(forgotPass)}>
          <p>Recovery password</p>
        </Button>
      </FormContainer>
    );
  }

  if (errMessage === "User is not confirmed.") {
    return (
      <div>
        {errMessage && <p className="error-message">{errMessage}</p>}
        <p>
          {userNotConfirmed}, we sent a verification code to your email. Please,
          enter the code below.
        </p>
        <input
          type="Password"
          placeholder="Password"
          {...register("password", { required: true })}
        />

        <Button onClick={handleSubmit(confirmUser)}>
          Confirm your account
        </Button>
      </div>
    );
  }

  return (
    <FormContainer>
      <input
        type="text"
        placeholder="Username"
        {...register("username", { required: true })}
      />
      {errors.username && <p className="error-message">Username is required</p>}

      <input
        type="Password"
        placeholder="Password"
        {...register("password", { required: true })}
      />

      {errors.password && <p className="error-message">Password is required</p>}

      <Button onClick={handleSubmit(signIn)}>
        <p>Sign in</p>
      </Button>

      {errMessage && <p className="error-message">{errMessage}</p>}
      <div>
        <p onClick={() => setPassForgot(true)} className="Button-text">
          {"< Forgotten password? />"}
        </p>
      </div>
    </FormContainer>
  );
};

export default SignIn;
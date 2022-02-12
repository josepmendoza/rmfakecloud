import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import NoMatch from "./NoMatch";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "./Spinner";
import useFetch from "../hooks/useFetch";
import apiService from "../services/api.service";

import {Alert} from "react-bootstrap";

const userListUrl = "users";

export default function UserProfileModal(params) {
  const { userid } = params;
  const { data: user, loading, error } = useFetch(`${userListUrl}/${userid}`);
  const history = useHistory();

  const [formErrors, setFormErrors] = useState({});
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: "",
  });

  function handleChange({ target }) {
    setResetPasswordForm({ ...resetPasswordForm, [target.name]: target.value });
  }

  function formIsValid() {
    const _errors = {};

    if (!resetPasswordForm.newPassword)
      _errors.error = "newPassword is required";

    setFormErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formIsValid()) return;

    try {
      await apiService.updateuser({
        userid,
        newPassword: resetPasswordForm.newPassword,
      });
      history.push("/userList")
      
    } catch (e) {
      setFormErrors({ error: e.toString()});
    }
  }

  if (loading) return <Spinner />;

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>An Error Occurred</Alert.Heading>
        {`Error ${error.status}: ${error.statusText}`}
      </Alert>
    );
  }

  if (!user) return <NoMatch />;

  return (
    <div>
      <div>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          className="font-weight-bold"
          placeholder="Enter email"
          value={userid}
          disabled
        />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formPasswordRepeat">
          <Form.Label>Change Password</Form.Label>
          <div style={{ display: "flex", gap: "4px", }}>
            <Form.Control
              type="password"
              placeholder="new password"
              value={resetPasswordForm.newPassword}
              name="newPassword"
              onChange={handleChange}
            />
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form.Group>
        {formErrors.error && (
          <div className="alert alert-danger">{formErrors.error}</div>
        )}

      </Form>
    </div>
  );
}

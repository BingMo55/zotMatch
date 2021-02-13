import "../App.css";
import React from "react";
import { Form, Formik, useField, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CustomTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const CustomDropDown = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default function ZotForm() {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        major: "",
        studentOne: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().required("required"),
        lastName: Yup.string().required("required"),
        email: Yup.string().email("Invalid Email").required("required"),
        major: Yup.string().required("required"),
        studentOne: Yup.string().required("required"),
        studentTwo: Yup.string(),
        studentThree: Yup.string(),
      })}
      onSubmit={(values, { setSubmitting }, resetForm) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          resetForm();
          setSubmitting(false);
        }, 3000);
      }}
    >
      {(props) => (
        
        <Form>
          <div class="row">
            <div class="column input">
              <div class="label">
              first
              </div>
              <CustomTextInput
              name="firstName"
              type="text"
              placeholder="peter"
              />
            </div>
            <div class="column input">
              <div class="label">
              last
              </div>
              <CustomTextInput
              name="lastName"
              type="text"
              placeholder="anteater"
              />
            </div>
          </div>
          <div class="row">
            <div class="column input">
              <div class="label">
              email
              </div>
              <CustomTextInput
                  name="email"
                  type="email"
                  placeholder="anteater@uci.edu"
                  size="50"
                  />
            </div>
          </div>
          <div class="row">
      {/*
            <div class="column input">
              <CustomDropDown name="year">
                <option value="" disabled selected>year</option>
                <option value="First Year">freshman</option>
                <option value="Second Year">sophomore</option>
                <option value="Third Year">junior</option>
                <option value="Fourth Year">senior</option>
                <option value="Other">Other</option>
              </CustomDropDown>
            </div>
      */}
            <div class="column side">
              <div class="label">
              major
              </div>
              <CustomTextInput
                  name="major"
                  type="text"
                  placeholder="wumbology"
                />
            </div>
          </div>
          <div class="row">
            <div class="column input">
            <div class="label">
              enter full names:
              </div>
              <CustomTextInput name="studentOne" type="text" size="50"/>
            </div>
          </div>
          <div class="row">
            <div class="column input">
              <CustomTextInput name="studentTwo" type="text" size="50"/>
            </div>
          </div>
          <div class="row">
            <div class="column input">
              <CustomTextInput name="studentThree" type="text" size="50"/>
            </div>
          </div>

          <div class="row">
          <div class="column side"/>
          <div class="column middle">
            <button type="submit" class="button">submit</button>
          </div>
          </div>
          
        </Form>
      )}
    </Formik>
  );
}

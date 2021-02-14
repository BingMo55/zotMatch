import "../App.css";
import React, { useState } from "react";
import { Form, Formik, useField, Field, ErrorMessage } from "formik";
import axios from 'axios';
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
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const normalizeName = (first,last) => {
    return first.toLowerCase() + last.toLowerCase()
  }

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        major: "",
        studentOne: "",
        studentTwo: "",
        studentThree: "",
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
      onSubmit={(values, { setSubmitting, resetForm
       }) => {
        setTimeout(async () => {
          const id = normalizeName(values.firstName, values.lastName)
          var likes = [values.studentOne, values.studentTwo, values.studentThree].map(name => {
            const n = name.split(" ")
            const first = n[0]
            const last = n.length > 1 ? n[1] : ""
            const name_id = normalizeName(first,last)
            return name_id
          })
          likes = likes.filter((like) => like !== id) // users cannot like themselves
          const uniqueLikes = Array.from(new Set(likes))
          const payload = {
            id: id,
            likes: uniqueLikes,
            email: values.email,
            name: values.firstName + " " + values.lastName,
            major: values.major
          }
          // verify existing
          /*
          const foundUser = await axios.get(`https://ov7mtcvxm5.execute-api.us-east-1.amazonaws.com/dev/users/${payload.email}`)
          console.log('Found',foundUser)
          if (foundUser.data){
            await axios.put(`https://ov7mtcvxm5.execute-api.us-east-1.amazonaws.com/dev/users/${payload.id}`, payload)
            setDuplicate(true)
            return
          }
          */
          await axios.post('https://ov7mtcvxm5.execute-api.us-east-1.amazonaws.com/dev/users',payload)
          resetForm();
          setSubmitting(false);
          setSubmitted(true);
          await axios.post('https://ov7mtcvxm5.execute-api.us-east-1.amazonaws.com/dev/match', payload)
        }, 500);
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
              enter full names
              </div>
              <CustomTextInput name="studentOne" type="text" placeholder="sarah anteater" size="50"/>
            </div>
          </div>
          <div class="row">
            <div class="column input">
              <CustomTextInput name="studentTwo" type="text" placeholder="oski bear"size="50"/>
            </div>
          </div>
          <div class="row">
            <div class="column input">
              <CustomTextInput name="studentThree" type="text" placeholder="sammy slug" size="50"/>
            </div>
          </div>

          <div class="row">
          <div class="column side"/>
          <div class="column middle">
            <button type="submit" class="button">submit</button>
          </div>
          
          </div>
          {
            duplicate ?
            <div>
              <p class="submitSuccess">Your submission has been updated.</p>
            </div>
            :
            ""
          }
          {
            submitted ?
              <div>
                <p class="submitSuccess">Thanks for your submission! 🎉
                </p>
                Please monitor your email for any potential matches. In the meantime, feel free to invite your friends to try our site!
              </div>
              :
              ""
          }
        </Form>
        
      )}
      
    </Formik>
    
  );
}

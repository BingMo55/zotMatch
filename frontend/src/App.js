import logo from "./logo.svg";
import "./App.css";
import React from "react";
import MaterialUiForm from "./form";
import { Form, Formik, useField } from "formik";
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
			<select {...field} {...props} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</>
	);
};


function App() {
	return (
		<Formik
			initialValues={{
				name: "",
				email: "",
				major: "",
			}}
			validationSchema={Yup.object({
				firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
				email: Yup.string().email("Invalid Email").required("Required"),
				major: Yup.string().required("Required"),
        studentOne: Yup.string().required("Required"),
        studentTwo: Yup.string(),
        studentThree: Yup.string()
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
					<h1>ZotMatch</h1>
					<CustomTextInput
						label="First Name"
						name="firstName"
						type="text"
						placeholder="peter"
					/>
					<CustomTextInput
						label="Last Name"
						name="lastName"
						type="text"
						placeholder="anteater"
					/>
					<CustomTextInput
						label="Email"
						name="email"
						type="email"
						placeholder="anteater@uci.edu"
					/>
					<CustomTextInput
						label="Major"
						name="major"
						type="text"
						placeholder="Computer Science"
					/>
					<CustomDropDown label="Year" name="year">
						<option value="First Year">First Year</option>
						<option value="Second Year">Second Year</option>
						<option value="Third Year">Third Year</option>
						<option value="Fourth Year">Fourth Year</option>
						<option value="Other">Other</option>
					</CustomDropDown>
          <p>enter three names of uci students below</p>
          <CustomTextInput
						name="studentOne"
						type="text"
					/>
          <CustomTextInput
						name="studentTwo"
						type="text"
					/>
          <CustomTextInput
						name="studentThree"
						type="text"
					/>
				</Form>
			)}
		</Formik>
	);
}

export default App;

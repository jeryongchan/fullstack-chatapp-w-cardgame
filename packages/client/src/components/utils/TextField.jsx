import React from 'react'
import TextField from '@mui/material/TextField'
import { useField } from 'formik'

const TextFieldWrapper = ({ name, ...otherProps }) => {
	const [field, meta] = useField(name)

	const configTextField = {
		fullWidth: true,
		variant: 'outlined',
		...field,
		// "named" props above apply to all
		// Textfields present.
		// "otherProps" below will be custom tailored
		// to particular Text/Date etc. Fields
		// such as label, type, id, etc.
		...otherProps
	}

	// meta object containes
	// submitForm, isSubmitting, touched, errors
	if (meta && meta.touched && meta.error) {
		configTextField.error = true
		configTextField.helperText = meta.error
	}

	return <TextField {...configTextField} />
}

export default TextFieldWrapper


// import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
// import { Input } from "@chakra-ui/input";
// import { Field, useField, useFormik } from "formik";

// const TextField = ({ label, ...props }) => {
//     const [field, meta] = useField(props);
//     return (
//         <FormControl isInvalid={meta.touched && meta.error}>
//             <FormLabel>{label}</FormLabel>
//             <Input as={Field} {...field} {...props} />
//             <FormErrorMessage>{meta.error}</FormErrorMessage>
//         </FormControl>
//     );
// };

// export default TextField;

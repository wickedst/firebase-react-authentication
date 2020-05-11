import * as yup from "yup";

// const usernameIsTaken = firebase.functions().httpsCallable("usernameIsTaken");

// yup.addMethod(yup.string, "usernameIsTaken", function (
//   message: string = "Username taken"
// ) {
//   return this.test("test-name", message, function (
//     value
//   ): any | yup.ValidationError {
//     return usernameIsTaken({ username: value })
//       .then(function (result) {
//         return !result.data;
//       })
//       .catch((err) => console.log(err));
//   });
// });

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

export default schema;

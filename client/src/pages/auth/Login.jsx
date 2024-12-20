// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { useGlobalContext } from "../../hooks/useGlobalContext";
// import { TOKEN, USER } from "../../context/reducer";
// import userImg from "../../assets/user.jpg";

// const Login = () => {
//   const [{ token, user }, dispatch] = useGlobalContext();
//   const navigate = useNavigate();

//   const setToken = () => {
//     dispatch({
//       type: TOKEN,
//       payload: true,
//     });

//     dispatch({
//       type: USER,
//       payload: {
//         name: "Abdi",
//         image: "https://avatars.githubusercontent.com/u/85553084?s=400&u=ce1e8c7e16ae30708152f0dc2ae5458699f2922e&v=4",
//         email: "Abdi@gmail.com",
//       },
//     });

//     navigate("/");
//   };

//   console.log(token);
//   console.log(user);

//   return (
//     <div className="flex flex-col items-center justify-center space-y-5 h-screen">
//       <div className="flex flex-col space-y-5 mt-6 shadow-xl p-10 w-[90%] md:w-[40%]">
//         <h1 className="text-center text-xl text-blackLight font-bold">Login</h1>
//         <div className="space-y-8">
//           <div className="top flex flex-col space-y-5">
//             {/* fields  */}
//             <div className="mt-5">
//               <label htmlFor="Email">Email</label>
//               <div className="">
//                 <input
//                   type="text"
//                   className="px-2 py-1 border-b border-black outline-none w-full"
//                   placeholder="doe@gmail.com"
//                 />
//               </div>
//             </div>
//             <div className="mt-5">
//               <label htmlFor="Password">Password</label>
//               <div className="">
//                 <input
//                   type="password"
//                   className="px-2 py-1 border-b border-black outline-none w-full"
//                   placeholder="*******"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="bottom flex flex-col items-center space-y-2">
//             <button className="px-12 py-2 rounded-sm bg-teal-600 text-white">
//               Login
//             </button>
//             <p>
//               you have not account{" "}
//               <Link to="/singup">
//                 <strong>Singup</strong>
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//       <button
//         onClick={() => setToken()}
//         className="py-2 rounded-sm bg-teal-600 text-white outline-none border-none w-[90%] md:w-[40%]"
//       >
//         Demo
//       </button>
//     </div>
//   );
// };

// export default Login;

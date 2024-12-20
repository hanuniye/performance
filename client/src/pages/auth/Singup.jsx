// import { useState } from "react";
// import nophoto from "../../assets/no-photo.png";
// import { UploadFileOutlined } from "@mui/icons-material";

// const Singup = () => {
//   const [file, setFile] = useState("");

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="flex flex-col space-y-5 mt-6 shadow-xl p-10 w-[90%] md:w-[50%]">
//         <h1 className="text-center text-xl text-blackLight font-bold">Login</h1>
//         <div className="flex flex-col space-y-5 items-center w-full md:space-x-10 md:items-start md:flex-row">
//           <div className="left">
//             <img
//               src={file ? URL.createObjectURL(file) : nophoto}
//               alt=".."
//               className="w-20 h-20 md:w-28 md:h-28 rounded-full"
//             />
//           </div>
//           <div className="right space-y-8 w-full">
//             <div className="top">
//               {/* fields  */}
//               <div className="">
//                 <label htmlFor="file">
//                   Image: <UploadFileOutlined style={{ cursor: "pointer" }} />
//                 </label>
//                 <input
//                   type="file"
//                   id="file"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   className="hidden"
//                 />
//               </div>
//               <div className="mt-5">
//                 <label htmlFor="name">Name</label>
//                 <div className="">
//                   <input
//                     type="text"
//                     className="px-2 py-1 border-b border-black outline-none w-full"
//                     placeholder="jonh doe"
//                   />
//                 </div>
//               </div>
//               <div className="mt-5">
//                 <label htmlFor="Email">Email</label>
//                 <div className="">
//                   <input
//                     type="text"
//                     className="px-2 py-1 border-b border-black outline-none w-full"
//                     placeholder="doe@gmail.com"
//                   />
//                 </div>
//               </div>
//               <div className="mt-5">
//                 <label htmlFor="Password">Password</label>
//                 <div className="">
//                   <input
//                     type="password"
//                     className="px-2 py-1 border-b border-black outline-none w-full"
//                     placeholder="*******"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="bottom flex justify-center">
//               <button className="px-10 py-2 rounded-sm bg-teal-600 text-white">
//                 Login
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Singup;

// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import './AddUser.css';


// export default function AddUser() {

//     console.log("AddUser component rendered");
//   // State variables for attributes
//   const [nic, setNic] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [role, setRole] = useState("visitor"); // Default role
//   const [showModal, setShowModal] = useState(false);

//   function sendData(e) {
//     e.preventDefault();

//     const newUser = {
//       nic,
//       name,
//       email,
//       address,
//       phone,
//       dob,
//       gender,
//       role
//     };

//     axios
//       .post("http://localhost:8070/users/add", newUser)
//       .then(() => {
//         setShowModal(true);
//         resetForm();
//       })
//       .catch((err) => {
//         alert("Error adding user: " + err);
//       });
//   }

//   function resetForm() {
//     setNic("");
//     setName("");
//     setEmail("");
//     setAddress("");
//     setPhone("");
//     setDob("");
//     setGender("");
//     setRole("visitor");
//   }

//   function handleOK() {
//     setShowModal(false);
//   }

//   return (
//     <div className="container">
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card">
//             <div className="card-body">
//               {/* Confirmation Modal */}
//               {showModal && (
//                 <div className="modal" style={{ display: "block" }}>
//                   <div className="modal-dialog">
//                     <div className="modal-content">
//                       <div className="modal-header">
//                         <h5 className="modal-title">User Added</h5>
//                       </div>
//                       <div className="modal-body">
//                         <p>User has been successfully added!</p>
//                       </div>
//                       <div className="modal-footer">
//                         <Link to="/users" className="btn btn-primary" onClick={handleOK}>
//                           OK
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <form onSubmit={sendData}>
//                 {/* NIC */}
//                 <div className="mb-3">
//                   <label htmlFor="nic" className="form-label">NIC</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="nic"
//                     name="nic"
//                     value={nic}
//                     onChange={(e) => setNic(e.target.value)}
//                     placeholder="Enter NIC"
//                   />
//                 </div>
//                 {/* Name */}
//                 <div className="mb-3">
//                   <label htmlFor="name" className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="name"
//                     name="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Enter name"
//                   />
//                 </div>
//                 {/* Email */}
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     name="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter email"
//                   />
//                 </div>
//                 {/* Address */}
//                 <div className="mb-3">
//                   <label htmlFor="address" className="form-label">Address</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="address"
//                     name="address"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     placeholder="Enter address"
//                   />
//                 </div>
//                 {/* Phone */}
//                 <div className="mb-3">
//                   <label htmlFor="phone" className="form-label">Phone</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="phone"
//                     name="phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="Enter phone number"
//                   />
//                 </div>
//                 {/* Date of Birth */}
//                 <div className="mb-3">
//                   <label htmlFor="dob" className="form-label">Date of Birth</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     id="dob"
//                     name="dob"
//                     value={dob}
//                     onChange={(e) => setDob(e.target.value)}
//                   />
//                 </div>
//                 {/* Gender */}
//                 <div className="mb-3">
//                   <label htmlFor="gender" className="form-label">Gender</label>
//                   <select
//                     className="form-control"
//                     id="gender"
//                     name="gender"
//                     value={gender}
//                     onChange={(e) => setGender(e.target.value)}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 {/* Role */}
//                 <div className="mb-3">
//                   <label htmlFor="role" className="form-label">Role</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="role"
//                     name="role"
//                     value={role}
//                     onChange={(e) => setRole(e.target.value)}
//                     placeholder="Enter role (default: visitor)"
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary">Submit</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './AddUser.css';


export default function AddUser() {

    console.log("AddUser component rendered");
  // State variables for attributes
  const [nic, setNic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("visitor"); // Default role
  const [showModal, setShowModal] = useState(false);

  function sendData(e) {
    e.preventDefault();

    const newUser = {
      nic,
      name,
      email,
      address,
      phone,
      dob,
      gender,
      role
    };

    axios
      .post("http://localhost:8070/users/add", newUser)
      .then(() => {
        setShowModal(true);
        resetForm();
      })
      .catch((err) => {
        alert("Error adding user: " + err);
      });
  }

  function resetForm() {
    setNic("");
    setName("");
    setEmail("");
    setAddress("");
    setPhone("");
    setDob("");
    setGender("");
    setRole("visitor");
  }

  function handleOK() {
    setShowModal(false);
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {/* Confirmation Modal */}
              <h1 className="text-3xl font-bold underline ">
      Hello world!
    </h1>
              {showModal && (
                <div className="modal" style={{ display: "block" }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">User Added</h5>
                      </div>
                      <div className="modal-body">
                        <p>User has been successfully added!</p>
                      </div>
                      <div className="modal-footer">
                        <Link to="/users" className="btn btn-primary" onClick={handleOK}>
                          OK
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={sendData}>
                {/* NIC */}
                <div className="mb-3">
                  <label htmlFor="nic" className="form-label">NIC</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nic"
                    name="nic"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    placeholder="Enter NIC"
                  />
                </div>
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                {/* Address */}
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
                {/* Phone */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                {/* Date of Birth */}
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                {/* Gender */}
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select
                    className="form-control"
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* Role */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role (default: visitor)"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



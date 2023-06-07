import React, { useState } from "react";
import { db } from "../firebase";

function App() {
  const [ID, setID] = useState("");

  var dbData = {};

  const handleSubmitCode = (e) => {
    e.preventDefault();
    console.log(ID);
    db.collection("rh92K24FhlCns19KymO8")
      .doc(ID)
      .onSnapshot(function (doc) {
        dbData = doc.data();
        console.log(dbData);
      });
  };


  return (
    <>
      <div className="center">

        <form className="form" onSubmit={handleSubmitCode}>
          <input
            autoFocus
            type="text"
            value={ID}
            id="Name"
            onChange={(e) => setID(e.target.value)}
            name="Name"
          />
        </form>
      </div>
    </>
  );
}

export default App;
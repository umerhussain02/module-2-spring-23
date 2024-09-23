import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [list, setList] = useState(null);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [disable, setDisable] = useState(false);

  // Read
  const getData = async () => {
    const response = await axios.get("http://localhost:4000/users");
    try {
      const data = response.data;
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Create
  const addUser = async () => {
    if (!text) {
      alert("User is required");
    } else {
      await axios.post("http://localhost:4000/add", { name: text });
    }
    setText("");
    getData();
  };

  // handle on click edit button
  const handleOnEdit = (id) => {
    const user = list.find((item) => item._id === id);
    // console.log(user);

    setText(user.name);
    setUserId(id);
    setToggle(true);
    setDisable(true);
  };

  // Update
  const updateUser = async () => {
    if (text && toggle) {
      await axios.put(`http://localhost:4000/update/${userId}`, {
        name: text,
      });

      setUserId(null);
      setToggle(false);
      setDisable(false);
      setText("");
      getData();
    } else {
      alert("For Update this user input file not to be empty");
    }
  };

  // Delete
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:4000/delete/${id}`);
    getData();
  };

  return (
    <main
      style={{
        textAlign: "center",
      }}
    >
      <h1>User List</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={toggle === true ? "Update User" : "Add New User"}
      />

      {toggle === true ? (
        <button onClick={updateUser}>Update User</button>
      ) : (
        <button onClick={addUser}>Add New User</button>
      )}

      <ol>
        {list?.map((item, index) => (
          <div
            key={index}
            style={{
              margin: "0 auto",
              width: "20%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <li>{item.name}</li>

            <div>
              <button disabled={disable} onClick={() => handleOnEdit(item._id)}>
                Edit
              </button>
              <button disabled={disable} onClick={() => deleteUser(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </ol>
    </main>
  );

  // ---------------

  // return (
  //   <>
  //     <h1>List</h1>
  //     <input value={text} onChange={(e) => setText(e.target.value)} />
  //     <button onClick={addUser}>Add User</button>
  //     <ol>
  //       {list?.map((index, item) => (
  //         <div key={index}>
  //           <li>{item.name}</li>
  //         </div>
  //       ))}
  //     </ol>
  //   </>
  // );
}

export default App;

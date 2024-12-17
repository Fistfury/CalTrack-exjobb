import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

type DocumentData = {
  field: string;
};

export const AddData = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "entries"), {
        field: inputValue,
      } as DocumentData);
      console.log("Document added");
      setInputValue("");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter data"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <button type="submit">Add Data</button>
    </form>
  );
};

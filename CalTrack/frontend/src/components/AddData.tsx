import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Input } from "./Input";
import { Button } from "./Button";
import styles from "./styles/addData.module.scss";

export const AddData = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await addDoc(collection(db, "entries"), { field: inputValue });
      console.log("Document added successfully!");
      setInputValue("");
    } catch (err) {
      console.error("Error adding document:", err);
      setError("Failed to add document.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addDataForm}>
      <h2>Add Data</h2>
      <Input
        placeholder="Enter data"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <Button type="submit">Add Data</Button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

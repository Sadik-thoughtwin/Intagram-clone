import { useState } from "react";
import { Button } from "@mui/material";
import firebase from "firebase";
import { storage, db } from "../firebase";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    // this will pick the FIRST file selected (to avoid selecting many)
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //error function
        console.log(error);
        alert(error.message);
      },

      () => {
        //complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside of db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageurl: url,
              username: username,
            });

            setProgress(0);
            setCaption("");
            // setImage(null);
          });
      }
    );
  };
  return (
    
    <div className="imageupload">
      <h3 className="add_post">You can add your post </h3>

      <input
        type="text"
        className="input_data"
        placeholder="caption value..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <progress className="imageupload__progress" value={progress} max="100" />
      <br />
      <input type="file" onChange={handleChange} />
      <br />
      <br />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;

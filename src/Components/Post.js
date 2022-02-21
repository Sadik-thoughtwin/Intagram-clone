import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import "/home/dell/Music/insta/src/Post.css";
import { db } from "../firebase";
import { Input, Button } from "@material-ui/core";
import firebase from "firebase";

function Post({ user, postId, username, caption, imageurl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
    setSuccess(true);
  };


  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt="image"
          src="data:image/png;base64,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"
        />
        <h3> {username}</h3>
      </div>
      <img className="post_images" src={imageurl} alt=""></img>
      <h2 className="post_text">
        <strong>{username}</strong>:{caption} Instagram is an American photo and video sharing social networking service.
      </h2>

      {comments.map((val, id) => {
        return (
          <div className="post_comments" key={id}>
            <p>
              <strong className="user_name">{val.username}</strong>
              <span className="post_comm">{val.text}</span>
            </p>
          </div>
        );
      })}

      <form className="post_commentBox">
        <center>
          <Input
            className="post_input"
            type="text"
            placeholder="Enter comments..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            type="submit"
            className="post_button"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </Button>
        </center>
      </form>
    </div>
  );
}

export default Post;

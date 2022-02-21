import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Components/Post";
import { auth, db } from "./firebase";
import { Modal, makeStyles } from "@material-ui/core";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./Components/ImageUpload";
import Header from "./Components/Header";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

function getModelStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App(props) {
  const classes = useStyles();
  const [modalStyle] = useState(getModelStyle);
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user has logged in...
        setUser(authUser);
      } else {
        // if user has logged out...
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions

      unsubscribe();
    };
  }, [user, username]);

  //for backEnd data
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // Close modal
    setOpenSignIn(false);
  };
  return (
    <>
      {!props.user && <Navigate to="/" />}
      
      <div className="App">
        {user ? (<><Header />
          <Button onClick={() => auth.signOut()}>Logout</Button></>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>sign_In</Button>
            <Button onClick={() => setOpen(true)}>sign_Up</Button>
          </div>
        )}
        {user? (
          <ImageUpload username={user.displayName} user = {user} />
        ) : (
          <h2>Please login first </h2>
        )}

        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <h2>Instagram</h2>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <Button type="submit" onClick={signUp}>
                  signUp
                </Button>
              </center>
            </form>
          </div>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
              <center>
                <h2 className="head">Instagram</h2>

                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <Button type="submit" onClick={signIn}>
                  sign_In
                </Button>
              </center>
            </form>
          </div>
        </Modal>

        <div className="app_posts">
          {user && <div className="app_posLeft">
            {posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageurl={post.imageurl}
              />
            ))}
          </div>}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};
export default connect(mapStateToProps)(App);

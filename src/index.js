// Destructuring console
const { log } = console;
//
// importing  all required functions Firebase
import { initializeApp } from "firebase/app";
// importing neccessary functions
import {
  getFirestore, //connecting to db
  collection, // getting databeses
  getDocs, // getting database documents
  addDoc, // adding documents to database
  deleteDoc, // deleting from databese
  doc, // getting a single document from database
  onSnapshot, // getting realtime collection
  query, // querying a collection
  where,
  orderBy, // ordering
  serverTimestamp, // setting up timestamp
  getDoc, // getting a single document
  updateDoc, // updating document
} from "firebase/firestore";

// authentication
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyD47ZM-8qJ-SJHoWBS6_f8joZvHTfDhg5c",
  authDomain: "fir-9-93292.firebaseapp.com",
  projectId: "fir-9-93292",
  storageBucket: "fir-9-93292.appspot.com",
  messagingSenderId: "511935455647",
  appId: "1:511935455647:web:768b7b401f7f667df29daa",
};

//initialize firebase
initializeApp(firebaseConfig);

//initializing firestore
const db = getFirestore();
const auth = getAuth();

// getting hold of collection/database reference
const myBooks_DB = collection(db, "my_books"); // my_books database
// const users_DB = collection(db, "users"); // users database

//queries getting documents based on its author
const q = query(myBooks_DB, orderBy("createdAt"));

//getting collection/database data without snapshot
// getDocs(myBooks_DB).then((snapshot) => {
//   const books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   log(books);
// }); //catch err is there's any...

//

//getting Realtime collection
const unsubCol = onSnapshot(q, (snapshot) => {
  const books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  log(books);
});

//adding a document
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // insert into (database name, {details});
  addDoc(myBooks_DB, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    log(1);
    addBookForm.reset();
  }); //catch err is there's any...
});

//

//deleting document
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //
  const myBooks_DB = doc(db, "my_books", deleteBookForm.id.value);
  deleteDoc(myBooks_DB)
    .then(() => {
      log("book deleted succesfully");
      deleteBookForm.reset();
    })
    .catch((err) => {
      log(err.message);
    });
});

//get a single document
// const myBooks_col = doc(db, "my_books", "Qgp5NcJciBXeUKRxAfI1");
// const unsubDoc = onSnapshot(myBooks_col, (doc) => {
//   log(doc.data(), doc.id);
// });

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const myBooks_DB = doc(db, "my_books", updateForm.id.value);
  updateDoc(myBooks_DB, {
    title: "lorem ipsum dolor sit amet",
  }).then(() => {
    updateForm.reset();
  });
});

// authentication
// adding users
const signUp = document.querySelector(".signup");
signUp.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUp.email.value;
  const password = signUp.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // log("user created:", cred.user);
    })
    .catch((err) => {
      log(err.message);
    });
});

// logging in and logging out
const login = document.querySelector(".login");
login.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = login.email.value;
  const password = login.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      // log("user logged in", cred.user);
    })
    .catch((err) => {
      log(err.message);
    });
});

//logout
const logout = document.querySelector(".logout");
logout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // log("user signed out");
    })
    .catch((err) => {
      log(err.message);
    });
});

//subscribing to auth change
const unsubAuth = onAuthStateChanged(auth, (user) => {
  log("user status changed:", user);
});

// unsubscribing
const unsub = document.querySelector(".unsub");
unsub.addEventListener("click", () => {
  log("unsubscribing");
  unsubCol();
  unsubAuth();
});

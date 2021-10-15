import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeEfYpkbeA8fbuDbZAGUfLZuPMVjR1wlI",
  authDomain: "roarnpkg.firebaseapp.com",
  projectId: "roarnpkg",
  storageBucket: "roarnpkg.appspot.com",
  messagingSenderId: "339209543948",
  appId: "1:339209543948:web:f4f8780b322092154be929",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const signIn = (token: string) => signInWithCustomToken(auth, token);
export const signOut = () => auth.signOut();

export const storage = getStorage(app);
export const upload = (path: string, file: Buffer) => {
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, file);
};

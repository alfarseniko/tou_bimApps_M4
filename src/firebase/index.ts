/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import { initializeApp } from "firebase/app";
import * as Firestore from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

/** ################################################### */
/*--------------------CONFIGURATION-------------------- */
/** ################################################### */
const firebaseConfig = {
  apiKey: "AIzaSyAGH5k2FQqKvFVreg2ugTWqdqq9DM2ghpY",
  authDomain: "bim-dev-masrwe.firebaseapp.com",
  projectId: "bim-dev-masrwe",
  storageBucket: "bim-dev-masrwe.firebasestorage.app",
  messagingSenderId: "301801062903",
  appId: "1:301801062903:web:0495c925a942f0b78deef2",
};

/*--------------------CONSTANTS-------------------- */
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

/*--------------------GET COLLECTION-------------------- */
export function getCollection<T>(path: string = "/projects") {
  return Firestore.collection(db, path) as Firestore.CollectionReference<T>;
}

/*--------------------DELETE PROJECT-------------------- */
export async function deleteProject(path: string, id: string) {
  const doc = Firestore.doc(db, `${path}/${id}`);
  await Firestore.deleteDoc(doc);
}

/*--------------------UPDATE PROJECT-------------------- */
export async function updateProject<T extends Record<string, any>>(
  path: string,
  id: string,
  data: T
) {
  const doc = Firestore.doc(db, `${path}/${id}`);
  await Firestore.updateDoc(doc, data);
}

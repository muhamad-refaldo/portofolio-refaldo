/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  increment,
  serverTimestamp,
  collection,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useSiteStats = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    if (typeof __app_id === "undefined") return;

    const appId = __app_id;
    const safeAppId = appId.replace(/[^a-zA-Z0-9_-]/g, "_");

    const visitorDocRef = doc(
      db,
      "artifacts",
      safeAppId,
      "public",
      "data",
      "visitors",
      "stats"
    );
    const onlineCollRef = collection(
      db,
      "artifacts",
      safeAppId,
      "public",
      "data",
      "online_users"
    );

    const unsubscribeVisits = onSnapshot(visitorDocRef, (doc) => {
      if (doc.exists()) {
        setVisitorCount(doc.data().count || 0);
      }
    });

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(visitorDocRef);

          if (docSnap.exists()) {
            const currentCount = docSnap.data().count;

            if (currentCount >= 1000) {
              await setDoc(visitorDocRef, { count: 101 }, { merge: true });
            } else {
              await updateDoc(visitorDocRef, { count: increment(1) });
            }
          } else {
            await setDoc(visitorDocRef, { count: 100 });
          }
        } catch (error) {
          console.error("Gagal update visitor:", error);
        }

        const uniqueId =
          user.uid + "_" + Math.random().toString(36).substring(2, 9);
        const userOnlineDocRef = doc(onlineCollRef, uniqueId);

        setDoc(userOnlineDocRef, {
          joinedAt: serverTimestamp(),
          userAgent: navigator.userAgent,
          uid: user.uid,
        }).catch((err) => console.error("Online tracking err:", err));

        const handleDisconnect = () => {
          deleteDoc(userOnlineDocRef).catch(() => {});
        };
        window.addEventListener("beforeunload", handleDisconnect);
      }
    });

    const unsubscribeOnline = onSnapshot(onlineCollRef, (snapshot) => {
      setOnlineCount(snapshot.size);
    });

    return () => {
      unsubscribeVisits();
      unsubscribeAuth();
      unsubscribeOnline();
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  return { visitorCount, onlineCount };
};

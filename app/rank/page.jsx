"use client";

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// 🔒 Config Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🕒 format date simple
const formatDate = (date) =>
  new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function RankPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopScores = async () => {
      try {
        const scoresRef = collection(db, "scores");
        const q = query(scoresRef, orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);

        const topScores = snapshot.docs.map((doc) => doc.data());
        setScores(topScores);
      } catch (error) {
        console.error("Erreur récupération top 10 :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopScores();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "28px",
        padding: "40px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        margin: "40px auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "2rem",
          color: "#ffd166",
          fontWeight: "bold",
        }}
      >
        🏆 Top 10 des meilleurs scores
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(255,209,102,0.25)",
                color: "#ffd166",
                height: "50px",
              }}
            >
              <th>#</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {scores.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: "15px" }}>
                  Aucun score enregistré
                </td>
              </tr>
            )}

            {scores.map((item, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  height: "48px",
                }}
              >
                <td>{idx + 1}</td>
                <td style={{ color: "#ffd166", fontWeight: "bold" }}>
                  {item.score} / 12
                </td>
                <td>{formatDate(item.createdAt.seconds * 1000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "30px",
            padding: "12px 30px",
            borderRadius: "999px",
            background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#1b1b1b",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

// Réponses avec variantes
const answers = {
  janvier: ["athlete", "athlète", "coureur", "sprinter"],
  fevrier: ["basketteur"],
  mars: ["graphiste", "designer"],
  avril: [
    "ingenieur",
    "ingénieur",
    "mecano",
    "mécano",
    "mecanicien",
    "mécanicien",
  ],
  mai: ["pilote", "pilote f1", "pilote de f1"],
  juin: ["saxophoniste"],
  juillet: ["ecrivain", "écrivain", "poete", "poète"],
  aout: ["boxeur"],
  septembre: ["acteur", "agent secret"],
  octobre: ["handballer"],
  novembre: ["militaire", "soldat"],
  decembre: ["developpeur", "développeur", "programmeur"],
};

// Normalisation des réponses
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Composant Modal

function RecapModal({ results, score, onClose }) {

  const months = Object.keys(results);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "30px",
          borderRadius: "24px",
          maxWidth: "800px",
          width: "90%",
          maxHeight: "90vh", // limite la hauteur à 90% de l'écran
          overflowY: "auto", // permet de scroller verticalement si besoin
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "2rem",
            fontWeight: "800",
            letterSpacing: "1px",
            color: "#fff",
          }}
        >
          {score === 12 ? (
            <>
              🎉 Bravo !
              <br />
              <span style={{ color: "#ffd166", fontSize: "2.4rem" }}>
                12 / 12
              </span>
              <br />
              métiers trouvés !
            </>
          ) : (
            <>
              🎯 Score
              <br />
              <span style={{ color: "#ffd166", fontSize: "2.4rem" }}>
                {score} / 12
              </span>
              <br />
              métiers trouvés
            </>
          )}
        </div>

        <h2
          style={{
            textAlign: "center",
            color: "#ffd166",
            marginBottom: "20px",
          }}
        >
          📝 Récapitulatif de tes réponses
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ color: "#ffd166", height: "40px" }}>
              <th>Mois</th>
              <th>Réponse</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month, idx) => (
              <tr
                key={month}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  height: "45px",
                }}
              >
                <td>{month}</td>
                <td>
                  {results[month].userAnswer
                    ? results[month].userAnswer.length > 7
                      ? results[month].userAnswer.slice(0, 7) + "…"
                      : results[month].userAnswer
                    : "-"}
                </td>

                <td>
                  {results[month].isValid ? (
                    <Check color="#00ff7f" size={20} />
                  ) : (
                    <X color="#ff4d4d" size={20} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 25px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  const [time, setTime] = useState(10);
  const [score, setScore] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [results, setResults] = useState({});
  const [showRecap, setShowRecap] = useState(false);
  const timerRef = useRef(null);

  const months = Object.keys(answers);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime((t) => {


        if (t <= 1) {
          clearInterval(timerRef.current);
            const sound = document.getElementById("endSound");
            if (sound) {
              sound.currentTime = 0;
              sound.play().catch(() => {});
            }
         setTimeout(() => {
           handleSubmit();
         }, 1000);

          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    clearInterval(timerRef.current);

    const form = document.getElementById("game");
    const data = new FormData(form);

    let formScore = 0;
    const newResults = {};

    months.forEach((month) => {
      const userAnswer = data.get(month) || "";
      const normalizedAnswer = normalize(userAnswer);
      const validAnswers = answers[month].map(normalize);
      const isValid = validAnswers.includes(normalizedAnswer);
      if (isValid) formScore++;
      newResults[month] = { userAnswer, isValid };
    });

    setResults(newResults);
    setScore(formScore);
   
    setShowRecap(true); //  ouvre le modal automatiquement

    form.querySelectorAll("input").forEach((input) => (input.disabled = true));

    try {
      await setDoc(doc(db, "scores", crypto.randomUUID()), {
        score: formScore,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Erreur enregistrement score :", err);
    }
  };

  const handleRetry = () => {
    setScore(null);
    setCurrentSlide(0);
    setResults({});
    setShowRecap(false);

    const form = document.getElementById("game");
    form.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.disabled = false;
    });

    setTime(180);
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

 const nextSlide = () => {
   if (currentSlide === months.length - 1) return; // décembre
   setCurrentSlide(currentSlide + 1);
 };
  const prevSlide = () => {
    if (currentSlide === 0) return;
    setCurrentSlide(currentSlide - 1);
  };

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f3d2e, #1b6b4f)",
        minHeight: "100vh",
        padding: "30px",
        color: "#fff",
      }}
    >
      <audio id="endSound" src="/finjeu.mp3" preload="auto" />

      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        As-tu l&apos;œil pour reconnaître ces métiers ?
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "1.2rem",
          marginBottom: "25px",
          color: "#ffd166",
        }}
      >
        Temps restant : {minutes}:{seconds}
      </p>

      <form id="game" onSubmit={handleSubmit}>
        <div
          className="slider-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto 40px",
            gap: "15px",
          }}
        >
          <div className="slides" style={{ width: "100%" }}>
            {months.map((month, idx) => (
              <div
                key={month}
                className={`card slide ${idx === currentSlide ? "active" : ""}`}
                style={{
                  display: idx === currentSlide ? "flex" : "none",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(255,255,255,.08)",
                  borderRadius: "24px",
                  padding: "18px",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Image
                  src={`/images/${month}.png`}
                  alt={month}
                  width={1000}
                  height={600}
                  className="slide-image"
                  style={{
                    width: "100%",
                    maxWidth: "1000px",
                    maxHeight: "65vh",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />

                <label
                  style={{
                    fontSize: "1.6rem",
                    marginBottom: "8px",
                  }}
                >
                  Métier N°{idx + 1}
                </label>

                <input
                  name={month}
                  type="text"
                  disabled={score !== null}
                  style={{
                    width: "75%",
                    maxWidth: "350px",
                    fontSize: "1.2rem",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: "none",
                    textAlign: "center",
                    backgroundColor: score !== null ? "#e0e0e0" : "white",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="slider-nav-buttons"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "25px",
              marginBottom: "-25px",
            }}
          >
            <button
              type="button"
              onClick={prevSlide}
              style={{
                background: "#ffd166",
                border: "none",
                borderRadius: "50%",
                width: "55px",
                height: "55px",
                fontSize: "1.6rem",
                cursor: "pointer",
              }}
            >
              ◀
            </button>

            <button
              type="button"
              onClick={nextSlide}
              style={{
                background: "#ffd166",
                border: "none",
                borderRadius: "50%",
                width: "55px",
                height: "55px",
                fontSize: "1.6rem",
                cursor: "pointer",
              }}
            >
              ▶
            </button>
          </div>
        </div>

        {currentSlide === months.length - 1 && (
          <button
            type="submit"
            style={{
              display: "block",
              margin: "0 auto",
              padding: "16px 40px",
              borderRadius: "999px",
              border: "none",
              fontWeight: "bold",
              fontSize: "1.2rem",
              background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
              cursor: "pointer",
            }}
          >
            Valider mes réponses
          </button>
        )}
      </form>

      {score !== null && (
        <div
          className="result"
          style={{
            textAlign: "center",
            marginTop: "25px",
            fontSize: "1.4rem",
          }}
        >
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleRetry}
              style={{
                display: "block",
                margin: "0 auto",
                padding: "16px 40px",
                borderRadius: "999px",
                border: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
          </div>

          <div
            style={{
              marginTop: "30px",
            }}
          >
            🏆
            <a
              href="/rank"
              style={{
                color: "#ffd166",
                fontWeight: "bold",
              }}
            >
              Voir le Top 10
            </a>
          </div>
        </div>
      )}

      {showRecap && (
        <RecapModal
          results={results}
          score={score}
          onClose={() => setShowRecap(false)}
        />
      )}
    </div>
  );
}

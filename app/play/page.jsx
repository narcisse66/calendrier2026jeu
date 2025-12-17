 "use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "../globals.css";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";


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

export default function PlayPage() {



  const [time, setTime] = useState(180);
  const [score, setScore] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  const months = [
    "janvier",
    "fevrier",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "aout",
    "septembre",
    "octobre",
    "novembre",
    "decembre",
  ];

  useEffect(() => {
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
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    clearInterval(timerRef.current);

    let formScore = 0;
    const form = document.getElementById("game");
    const data = new FormData(form);

    months.forEach((month) => {
      const input = form.querySelector(`input[name="${month}"]`);
      const userAnswer = normalize(data.get(month) || "");
      const validAnswers = answers[month].map(normalize);

      if (validAnswers.includes(userAnswer)) formScore++;

      let icon = input.parentElement.querySelector(".status");
      if (!icon) {
        icon = document.createElement("span");
        icon.classList.add("status");
        input.parentElement.appendChild(icon);
      }

      icon.textContent = validAnswers.includes(userAnswer) ? "✔" : "✖";
      icon.className = validAnswers.includes(userAnswer)
        ? "status good"
        : "status bad";

      input.disabled = true;
    });

    setScore(formScore);

    // ✅ Enregistrement ANONYME du score
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
    setScore(null); // réinitialiser le score
    setCurrentSlide(0); // revenir au premier slide
    // réactiver les inputs
    const form = document.getElementById("game");
    form.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.disabled = false;
      const icon = input.parentElement.querySelector(".status");
      if (icon) icon.remove();
    });
    // relancer le timer
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % months.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + months.length) % months.length);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div
      style={{
        padding: "30px",

        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        As-tu l&apos;œil pour reconnaître ces métiers ?
      </h1>
      <p
        className="timer"
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
            gap: "15px",
            maxWidth: "95vw",

            margin: "0 auto 40px",
          }}
        >
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
                minHeight: "70vh",

                marginBottom: "-25px",
                width: "100%",
                maxWidth: "1800px",
                position: "relative",
              }}
            >
              <Image
                src={`/images/${month}.png`}
                alt={`Mois ${month}`}
                width={1600}
                height={900}
                style={{
                  width: "100%",
                  maxWidth: "1600px",

                  maxHeight: "65vh",
                  objectFit: "contain",
                  borderRadius: "22px",
                  marginBottom: "8px",
                }}
              />
              <label
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "8px",
                }}
              >{`Métier N°${idx + 1}`}</label>
              <input
                name={month}
                type="text"
                style={{
                  width: "75%",
                  maxWidth: "350px",
                  fontSize: "1.2rem",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "none",
                  textAlign: "center",
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
            marginBottom: "10px",
          }}
        >
          <button
            type="button"
            className="nav prev"
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
            className="nav next"
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

        <button
          type="submit"
          className="btn"
          style={{
            display: "block",
            margin: "0 auto",
            marginTop: "20px",
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
      </form>

      {score !== null && (
        <div
          className="result"
          style={{ textAlign: "center", marginTop: "25px", fontSize: "1.4rem" }}
        >
          {score === 12 ? (
            <>
              🎉 Bravo ! 12/12 métiers trouvés !{" "}
              <a
                href="/classement"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                Voir le classement
              </a>
            </>
          ) : (
            <>
              🎯 Score : {score}/12 métiers trouvés ! Réessaye pour améliorer
              ton classement.{" "}
              <a href="/rank" style={{ color: "yellow", textDecoration: "" }}>
                <br />
                Top 10
              </a>{" "}
              🚀
            </>
          )}
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => handleRetry()}
              style={{
                display: "block",
                margin: "0 auto",
                marginTop: "20px",
                padding: "16px 40px",
                borderRadius: "999px",
                border: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
                cursor: "pointer",
              }}
            >
              Réessayez
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

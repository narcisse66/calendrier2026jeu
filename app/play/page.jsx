 "use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";


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
  const [results, setResults] = useState({});


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

    const newResults = {};

    months.forEach((month) => {
      const userAnswer = normalize(data.get(month) || "");
      const validAnswers = answers[month].map(normalize);

      const isValid = validAnswers.includes(userAnswer);

      if (isValid) formScore++;

      newResults[month] = isValid;
    });

    setResults(newResults);
    setScore(formScore);

    // désactiver les inputs
    form.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
    });

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
    setResults({});

    // réinitialiser le formulaire
    const form = document.getElementById("game");
    form.querySelectorAll("input").forEach((input) => {
      input.value = "";
      input.disabled = false;
     
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
       background: "linear-gradient(135deg, #0f3d2e, #1b6b4f)",
       minHeight: "100vh",
       padding: "30px",
       color: "#fff",
     }}
   >
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
       {/* ================= SLIDER ================= */}
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
         {/* WRAPPER SLIDES (IMPORTANT) */}
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
                 height: "auto",
                 minHeight: "auto",
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
               {score !== null && results[month] !== undefined && (
                 <span
                   className={`status ${results[month] ? "good" : "bad"}`}
                   style={{ marginTop: "10px" }}
                 >
                   {results[month] ? (
                     <Check size={28} />
                   ) : (
                     <X size={28} />
                   )}
                 </span>
               )}
             </div>
           ))}
         </div>

         {/* NAVIGATION */}
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

       {/* SUBMIT */}
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
     </form>

     {/* RESULT */}
     {score !== null && (
       <div
         className="result"
         style={{
           textAlign: "center",
           marginTop: "25px",
           fontSize: "1.4rem",
         }}
       >
         {score === 12 ? (
           <>
             🎉 Bravo ! 12/12 métiers trouvés !
             <br />
             <a
               href="/classement"
               style={{
                 color: "#ffd166",
                 textDecoration: "underline",
                 fontWeight: "bold",
               }}
             >
               Voir le classement
             </a>
           </>
         ) : (
           <>
             🎯 Score : {score}/12 métiers trouvés !
             <br />
             Réessaie encore pour améliorer ton score.
             <br />
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
           </>
         )}

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
       </div>
     )}
   </div>
 );

}

"use client";

import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./home.module.css";

export default function HomePage() {
  const router = useRouter();


  return (
    <div 
    style={{
      
    }}
    className="container">
      <div className="content">
        <h1>
          🎁 Jeu de Calendrier <span>2026</span>
        </h1>
        <p>
          Amusez-vous à trouver les douze métiers cachés derrière chaque mois
          de ce calendrier de la nouvelle année !
        </p>
        <ul className="features">
          <li>1 mois = 1 métier</li>
          <li>Jeu simple et amusant</li>
          <li>Êtes-vous prêt ?</li>
        </ul>

        <div
          className="buttons-container"
        >
          <button className="cta" onClick={() => router.push("/play")}>
            🎮 Nouvelle partie
          </button>
          <button className="cta" onClick={() => router.push("/rank")}>
            🏆 Voir le Top 10
          </button>
        </div>

       
      </div>

      <div className="image">
        <img
          src="https://res.cloudinary.com/dp7fm3nsj/image/upload/v1765621269/calendar_game5_hnjflv.png"
          alt="Calendrier de Noël"
          style={{ maxWidth: "100%", height: "auto", marginTop: "-10px" }}
        />
      </div>

      <footer 
      style={{
        marginTop: "5px",}}>
        ✨ Vivez la magie des fêtes de fin d&apos;année – Partagez et invitez vos
        proches à jouer ✨
      </footer>
    </div>
  );
}

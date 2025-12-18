"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>
          🎁 Jeu de Calendrier <span>2026</span>
        </h1>
      
        <p>
          Chaque mois cache un métier derrière une image : à vous de tous les deviner en tapant vos réponses en seulement 3 minutes.
        
        </p>

        <ul className="features">
          <li>1 mois = 1 métier</li>
          <li>Jeu simple et amusant</li>
          <li>Êtes-vous prêt ?</li>
        </ul>

        <div className="buttons-container">
          <button className="cta" onClick={() => router.push("/play")}>
            🎮 Jouer maintenant
          </button>
          <button className="cta" onClick={() => router.push("/rank")}>
            🏆 Voir le Top 10
          </button>
        </div>
      </div>

      <div className="home-image">
        <img
          src="https://res.cloudinary.com/dp7fm3nsj/image/upload/v1765621269/calendar_game5_hnjflv.png"
          alt="Calendrier de Noël"
        />
      </div>

      <footer className="home-footer">
        ✨ Vivez la magie des fêtes de fin d&apos;année – Partagez et invitez vos
        proches à jouer ✨
      </footer>
    </div>
  );
}

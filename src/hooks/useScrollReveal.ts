"use client";

import { useEffect, useRef } from "react";

/**
 * Apparition au défilement des blocs situés sous la ligne de flottaison.
 * Garde-fous, identiques pour tous les visiteurs (aucun traitement selon le navigateur ou le robot) :
 * - rien n'est masqué si l'utilisateur refuse les animations, sans IntersectionObserver,
 *   ni pour un bloc déjà visible dans la fenêtre au chargement ;
 * - un bloc masqué est révélé dès qu'il entre dans la fenêtre, y compris quand la fenêtre est
 *   agrandie sans défilement (écran très haut, outil de rendu ou de capture pleine page).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    const inViewport = () => el.getBoundingClientRect().top < window.innerHeight;
    if (inViewport()) return;

    // Start hidden
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      // threshold plafonné : un bloc plus haut que l'écran doit quand même apparaître
      { threshold: Math.min(threshold, 0.05), rootMargin: "0px 0px -10% 0px" }
    );
    // La marge de -10 % ne s'applique pas ici : après un agrandissement, tout bloc entré dans la fenêtre apparaît
    const onResize = () => {
      if (inViewport()) reveal();
    };

    function stop() {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    }
    function reveal() {
      el!.style.opacity = "1";
      el!.style.transform = "translateY(0)";
      stop();
    }

    observer.observe(el);
    window.addEventListener("resize", onResize);
    return stop;
  }, [threshold]);

  return ref;
}

"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealScript() {
  const pathname = usePathname();

  // Update nav active link on every navigation
  useEffect(() => {
    document.querySelectorAll(".nav__links a").forEach(a => {
      a.classList.remove("is-active");
      if (a.getAttribute("href") === pathname) a.classList.add("is-active");
    });
  }, [pathname]);

  // Hamburger — set up once with cleanup
  useEffect(() => {
    const ham = document.querySelector(".nav__ham");
    const navLinks = document.querySelector(".nav__links");
    if (!ham || !navLinks) return;

    const toggle = () => {
      const open = navLinks.classList.toggle("is-open");
      ham.classList.toggle("is-open", open);
      ham.setAttribute("aria-expanded", open ? "true" : "false");
    };
    const closeOnOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".nav__in")) {
        navLinks.classList.remove("is-open");
        ham.classList.remove("is-open");
        ham.setAttribute("aria-expanded", "false");
      }
    };
    const closeOnLink = () => {
      navLinks.classList.remove("is-open");
      ham.classList.remove("is-open");
      ham.setAttribute("aria-expanded", "false");
    };

    ham.addEventListener("click", toggle);
    document.addEventListener("click", closeOnOutside as EventListener);
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", closeOnLink));

    return () => {
      ham.removeEventListener("click", toggle);
      document.removeEventListener("click", closeOnOutside as EventListener);
      navLinks.querySelectorAll("a").forEach(a => a.removeEventListener("click", closeOnLink));
    };
  }, []);

  return null;
}

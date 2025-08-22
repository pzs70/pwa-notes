// Menü működtetése
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

// Oldalak váltása
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href").substring(1);

    document.querySelectorAll("main section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(target).style.display = "block";

    // Ha az info oldalra megyünk, töltsük be a README.md-t
    if (target === "info") {
      loadReadme();
    }

    // Menü becsukása mobilon
    document.querySelector(".nav-links").classList.remove("show");
  });
});

// README.md betöltése és renderelése
async function loadReadme() {
  try {
    const res = await fetch("README.md");
    const md = await res.text();
    document.getElementById("readme-content").innerHTML = marked.parse(md);
  } catch (err) {
    document.getElementById("readme-content").innerHTML = "Nem sikerült betölteni a README.md fájlt.";
    console.error(err);
  }
}

// Service Worker regisztráció
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker regisztrálva");
  });
}

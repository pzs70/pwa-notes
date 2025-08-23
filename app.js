// Menü működtetése
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

// Oldalak váltása
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href").substring(1);
    console.log(target);

    document.querySelectorAll("main section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(target).style.display = "block";

    if (target === "info") {
      loadReadme();
    } else if (target === "lista") {
      loadSheetData();
    }

    document.querySelector(".nav-links").classList.remove("show");
  });
});

// README.md betöltése és renderelése
async function loadReadme() {
  const container = document.getElementById("info");
  container.innerHTML = "Betöltés folyamatban...";
  try {
    const res = await fetch("README.md", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP hiba: " + res.status);
    const md = await res.text();
    container.innerHTML = window.marked.parse(md);
  } catch (err) {
    container.innerHTML = "❌ Nem sikerült betölteni a README.md fájlt.";
    console.error("README betöltési hiba:", err);
  }
}

// Google sheet adatok betöltése, ID oszlop nélkül
async function loadSheetData() {
  const container = document.getElementById("lista");
  container.innerHTML = "<h1>Listázás</h1><p>Betöltés...</p>";

  try {
    const sheetId = "1w0JIPTdSvPST0BVbeNwkUuVr4ASntl-Ima3efw4g6v0";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const res = await fetch(url, { cache: "no-cache" });
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    console.log("A nyers Google Sheets válasz:", json);

    const rows = json.table.rows;
    const headers = json.table.cols;

    let html = `
      <h1>Listázás</h1>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead><tr>
    `;

    headers.forEach((header, i) => {
      if (i > 0) html += `<th>${header.label}</th>`;
    });

    html += `</tr></thead><tbody>`;

    rows.forEach(r => {
      if (!r.c) return;
      html += `<tr>`;
      r.c.forEach((c, i) => {
        if (i > 0) {
          let cellValue = (c && c.f) ? c.f : (c && c.v) ? c.v : "";
          html += `<td>${cellValue}</td>`;
        }
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = "<p>❌ Nem sikerült betölteni a Google Sheet-et.</p>";
    console.error(err);
  }
}

// Service Worker regisztráció
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker regisztrálva");
  });
}

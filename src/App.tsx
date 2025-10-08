import React from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import { SquadProvider } from "./context/SquadContext";
import layout from "./styles/layout.module.css";
import "normalize.css";
import "./styles/theme.css";


function getBasename() {
    const pub = process.env.PUBLIC_URL;
    if (!pub) return "/barca-squad";
    try { return new URL(pub).pathname || "/barca-squad"; } catch { return "/barca-squad"; }
}

export default function App() {
    return (
        <BrowserRouter basename={getBasename()}>
            <SquadProvider>
                <div className={layout.container}>
                    <header className={layout.header}>
                        <Link className={layout.link} to="/barca-squad">Barcelona Football Club Squad</Link>
                        <nav className={layout.nav}>
                            <Link className={layout.link} to="/barca-squad">Player List</Link>
                            <Link className={layout.link} to="/gallery">Player Gallery</Link>
                        </nav>
                        <span className={layout.badge}>CS409 MP2- Aniruddha Sonawane</span>
                    </header>
                    <main className={layout.main}>
                        <Routes>
                            <Route path="/barca-squad" element={<ListView />} />
                            <Route path="/gallery" element={<GalleryView />} />
                            <Route path="/player/:id" element={<DetailView />} />
                        </Routes>
                    </main>
                    <footer className={layout.footer}>
                        Data: <a href="https://www.football-data.org/" target="_blank" rel="noreferrer">football-data.org</a>
                        {" • "}
                        Images: <a href="https://www.thesportsdb.com/" target="_blank" rel="noreferrer">TheSportsDB</a>
                    </footer>
                </div>
            </SquadProvider>
        </BrowserRouter>
    );
}
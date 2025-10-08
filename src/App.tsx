import React from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import { SquadProvider } from "./context/SquadContext";
import layout from "./styles/layout.module.css";
import "normalize.css";
import "./styles/theme.css";

export default function App() {
    return (
        <BrowserRouter basename="/barca-squad">
            <SquadProvider>
                <div className={layout.container}>
                    <header className={layout.header}>
                        <Link className={layout.link} to="/">Barcelona Football Club Squad</Link>
                        <nav className={layout.nav}>
                            <Link className={layout.link} to="/">Player List</Link>
                            <Link className={layout.link} to="/gallery">Player Gallery</Link>
                        </nav>
                        <span className={layout.badge}>CS409 MP2- Aniruddha Sonawane</span>
                    </header>
                    <main className={layout.main}>
                        <Routes>
                            <Route path="/" element={<ListView />} />
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
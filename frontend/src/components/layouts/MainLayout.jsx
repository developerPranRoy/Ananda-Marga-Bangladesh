import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MusicPlayer from "../common/MusicPlayer";

export default function MainLayout() {
    return (
        <div style={{ minHeight: "100vh", background: "#0d1f1e" }}>
            <Navbar />
            <Outlet />
            <Footer />
            <MusicPlayer src="/audio/baba-nam-kevalam.mp3" />
        </div>
    );
}
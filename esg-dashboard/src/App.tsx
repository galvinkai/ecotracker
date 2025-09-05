import Layout from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import Chatbot from "@/pages/Chat";
import EsgForm from "@/pages/EsgForm";
import Home from "@/pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="esg-dashboard-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="form" element={<EsgForm />} />
                        <Route path="chatbot" element={<Chatbot />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

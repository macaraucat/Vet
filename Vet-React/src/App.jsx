import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Index from './pages/Index'
import Catalogo from './pages/Catalogo'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Index />}/>
                <Route path="/catalogo" element={<Catalogo />}/>
            </Routes>
            <Footer />
        </BrowserRouter>
    )
}

export default App
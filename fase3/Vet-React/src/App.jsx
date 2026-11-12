import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Index from './pages/Index'
import Catalogo from './pages/Catalogo'
import Carrito from './pages/Carrito'
import Admin from './pages/Admin'
import Checkout from './pages/Checkout'
import { CarritoProvider, useCarritoContext } from './context/CarritoContext'
import Ofertas from './pages/Ofertas'

function AvisoCarrito() {
    const { mensaje } = useCarritoContext();
    if (!mensaje) return null;
    return (
        <Alert variant="success" className="text-center position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1050 }}>
            {mensaje}
        </Alert>
    );
}

function Shell() {
    const { pathname } = useLocation();
    const esAdmin = pathname.startsWith('/admin');

    return (
        <>
            {!esAdmin && <Header />}
            <AvisoCarrito />
            <Routes>
                <Route path="/" element={<Index />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/catalogo" element={<Catalogo />}/>
                <Route path="/producto/:id" element={<Catalogo />}/>
                <Route path="/carrito" element={<Carrito />}/>
                <Route path="/admin" element={<Admin />}/>
                <Route path="/checkout" element={<Checkout />}/>
                <Route path="/ofertas" element={<Ofertas />}/>
            </Routes>
            {!esAdmin && <Footer />}
        </>
    );
}

function App() {
    return (
        <CarritoProvider>
            <BrowserRouter>
                <Shell />
            </BrowserRouter>
        </CarritoProvider>
    );
}

export default App
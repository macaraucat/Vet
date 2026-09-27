import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Index from './pages/Index'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import { CarritoProvider, useCarritoContext } from './context/CarritoContext'

function AvisoCarrito() {
    const { mensaje } = useCarritoContext();
    if (!mensaje) return null;
    return (
        <div className="alert alert-success text-center position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1050 }}>
            {mensaje}
        </div>
    );
}

function App() {
    return (
        <CarritoProvider>
            <BrowserRouter>
                <Header />
                <AvisoCarrito />
                <Routes>
                    <Route path="/" element={<Index />}/>
                    <Route path="/catalogo" element={<Catalogo />}/>
                    <Route path="/producto/:id" element={<Producto />}/>
                    <Route path="/carrito" element={<Carrito />}/>
                </Routes>
                <Footer />
            </BrowserRouter>
        </CarritoProvider>
    )
}

export default App
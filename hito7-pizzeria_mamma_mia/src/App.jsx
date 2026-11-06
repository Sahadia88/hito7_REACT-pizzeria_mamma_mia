import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Pizza from './pages/Pizza'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { UserContext } from './context/UserContext'

function App() {
  const { token } = useContext(UserContext)

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Con sesión iniciada (token true) no se puede entrar a Register ni Login: va al Home */}
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />

        <Route path="/cart" element={<Cart />} />

        {/* :id es un parámetro de la URL, se lee con useParams en Pizza */}
        <Route path="/pizza/:id" element={<Pizza />} />

        {/* Ruta protegida: sin sesión (token false) redirige a /login */}
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" replace />}
        />

        <Route path="/404" element={<NotFound />} />
        {/* Ruta por defecto: cualquier URL que no exista termina en /404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App

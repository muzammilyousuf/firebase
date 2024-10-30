
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Screens/Home'
import About from './components/Screens/About';
import Contact from './components/Screens/Contact';
import Projects from './components/Screens/Projects';
import Login from './components/Screens/Login';
import Navbar from './components/Navigation/Navbar';
import Profile from './components/Screens/Profile';
import Signup from './components/Screens/Signup';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element= {<Home/>} > </Route>
          <Route path='/about' element= {<About/>} > </Route>
          <Route path='/contact' element= {<Contact/>} > </Route>
          <Route path='/projects' element= {<Projects/>} > </Route>
          <Route path='/login' element= {<Login/>} > </Route>
          <Route path='/profile' element= {<Profile/>} > </Route>
          <Route path='/signup' element= {<Signup/>} > </Route>
        
        </Routes>
      <ToastContainer/>
      </BrowserRouter>

    </div>
  );
}

export default App;

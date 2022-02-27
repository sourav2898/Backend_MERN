import './App.css';
import Header from './components/layout/Header/Header.js';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Footer from './components/layout/Footer';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
       <Route exact path="/" component={Home} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

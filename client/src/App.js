import './App.css';
import { Route } from 'react-router-dom';
import Create from './components/Create/Create'
// import Details from './components/Details/Details';
// import ErrorPage from './components/ErrorPage/ErrorPage';
// import Filters from './components/Filters/Filters';
import Home from './components/Home/Home';
// import LandingPage from './components/LandingPage/LandingPage';
import Navbar from './components/Navbar/Navbar';
// import OrderByAttack from './components/OrderByAttack/OrderByAttack';
// import OrderByName from './components/OrderByName/OrderByName';
// import Paginate from './components/Paginate/Paginate';
// import Pokemon from './components/Pokemon/Pokemon';
// import Pokemons from './components/Pokemons/Pokemons';
// import Searchbar from './components/Searchbar/Searchbar';

function App() {
  return (
    <div className="App">
      <Navbar/>

      <Route exact path="/">
        <Home/>
      </Route>

      <Route path="/create">
        <Create/>
      </Route>

      
    </div>
  );
}

export default App;

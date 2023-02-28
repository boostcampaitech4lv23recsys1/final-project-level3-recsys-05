import Template from "./template/Template";
import ProductDetail from "./products/detail/ProductDetail";
import { Switch, Route } from "react-router-dom";
import Landing from "./landing/Landing";
import ProductList from "./products/ProductList";
import Login from "./pages/Login"
import Join from "./pages/Register"
import History from './pages/History'
import Mypage from "./pages/Mypage";
import Detail from './pages/DetailPage'
import { useState, useEffect } from "react";


function App() {
  const [logined, setLogined] = useState(null)
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    setLogined(localToken);
  }, []);

  return (
    <Template logined={logined}>
      <div className="App">
      <Switch>
        <Route path="/products" exact>
          <ProductList />
        </Route>
        <Route path="/products/:slug">
          <ProductDetail />
        </Route>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Join />
        </Route>
        <Route path="/history/:userid" exact>
          <History />
        </Route>
        <Route path="/mypage/:userid" exact>
          <Mypage />
        </Route>
        <Route path="/detail/:itemid" exact>
          <Detail />
        </Route>
      </Switch>
      </div>
    </Template>
  );
}

export default App;
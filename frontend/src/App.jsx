import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
//
import { store } from "./store/index";
import Router from "./routes";
/**
 * Entry point in the react application. And also register the providers
 * @returns
 */
const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>
);
//
export default App;

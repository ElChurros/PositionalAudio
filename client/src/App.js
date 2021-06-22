import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from './components/CreateRoom';
import Room from './components/Room';
import AudioCtx from './contexts/audioCtx';

function App() {
  return (
    <AudioCtx.Provider value={"test"}>
      <BrowserRouter>
        <Switch>
          <Route path="/room/:id" component={Room} />
          <Route path='/' component={CreateRoom} />
        </Switch>
      </BrowserRouter>
    </AudioCtx.Provider>
  );
}

export default App;

import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from './components/CreateRoom';
import Room from './components/Room';
import AudioCtx from './contexts/audioCtx';


var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

function App() {
  return (
    <AudioCtx.Provider value={ctx}>
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

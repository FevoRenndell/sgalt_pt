import './App.css'
import QuotesPage from './features/quotes/pages/QuotesPage';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Router from './routes/index.jsx';

export default function App() {
  return (

    <Provider store={store}>
       
        <Router />
      
    </Provider>

  );
}
 
 

import './App.css'
import QuotesPage from './features/quotes/pages/QuotesPage';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Router from './routes/index';
import AppThemeProvider from './shared/providers/AppThemeProvider';


export default function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppThemeProvider>
    </Provider>
  );
}
 
 

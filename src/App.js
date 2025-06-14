import React from 'react';
import './_metronic/assets/sass/style.scss';
import './_metronic/assets/sass/plugins.scss';
import './_metronic/assets/sass/style.react.scss';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import './App.css';
import {ThemeModeProvider} from './_metronic/partials/layout/theme-mode/ThemeModeProvider';

function App() {
  return (
    <ThemeModeProvider>
      <Router>
        <div className="App">
          <Routes>
          Navbar

            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </div>
      </Router>
    </ThemeModeProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import RegularExpression from './pages/regularExpression';
import RegularGrammar from './pages/regularGrammar';


export default function Function_Routes() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' exact element={ <Home/> } />
        <Route path='/regularExpression' exact element={ <RegularExpression/> } />
        <Route path='/regularGrammar' exact element={ <RegularGrammar/> } />
    </Routes>
    </BrowserRouter>
  );
}


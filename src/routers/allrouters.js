import React from 'react'
import { Route, Routes } from "react-router-dom";
import Userwallet from '../pages/Userwallet';
import RecoverAccount from '../pages/RecoverAccount';

const allrouters = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Userwallet />}/>
        <Route path="/recoveraccount" element={<RecoverAccount />}/>
    </Routes>
    </>
  )
}

export default allrouters
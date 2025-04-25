import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import './App.css'
import Nasa from './Nasa_Image.jsx'
import MarsRover from './components/MarsRover.jsx'
import EarthViewer from './components/EarthViewer.jsx'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Nasa />} />
        <Route path="/mars-rover" element={<MarsRover />} />
        <Route path="/earth-view" element={<EarthViewer />} />
      </>
    )
  );

  return (
    <RouterProvider router={router} />
  )
}

export default App

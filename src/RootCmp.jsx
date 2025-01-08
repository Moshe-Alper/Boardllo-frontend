import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { BoardDetails } from './pages/BoardDetails.jsx'
import { UserProfile } from './pages/UserProfile.jsx'

import { AppHeader } from './cmps/AppHeader'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Test } from './pages/Test.jsx'

export function RootCmp() {
  return (
    <div className='main-container'>
      <AppHeader />
      <UserMsg />

      <main>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='board' element={<BoardIndex />} />
          <Route path='board/:boardId' element={<BoardDetails />} />
          <Route path='user/:id' element={<UserProfile />} />
          <Route path='admin' element={<AdminIndex />} />
          <Route path='login' element={<LoginSignup />}></Route>
          <Route path='test' element={<Test />}></Route>
        </Routes>
      </main>
    </div>
  )
}

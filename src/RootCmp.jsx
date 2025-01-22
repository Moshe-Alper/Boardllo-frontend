import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { BoardDetails } from './pages/BoardDetails.jsx'
import { UserProfile } from './pages/UserProfile.jsx'

import { AppHeader } from './cmps/AppHeader'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Test } from './pages/Test.jsx'
import { LoginForm } from './cmps/LoginForm.jsx'
import { SignupForm } from './cmps/SignupForm.jsx'
import { MobileSearch } from './cmps/MobileSearch.jsx'
import { DynamicPicker } from './cmps/DynamicPickers/DynamicPicker.jsx'
import { DynamicModal } from './cmps/DynamicModal.jsx'
import { TaskDetails } from './cmps/Task/TaskDetails.jsx'

export function RootCmp() {
  return (
    <div className='main-container'>
      <AppHeader />
      <UserMsg />
      <DynamicModal />
      <DynamicPicker />

      <main>
        <Routes>
          <Route path='' element={<HomePage />} />
          <Route path='board' element={<BoardIndex />} />
          <Route path='board/:boardId' element={<BoardDetails />} />
          <Route
            path='board/:boardId/:taskId'
            element={
              <>
                <BoardDetails />
                <TaskDetails />
              </>
            }
          />
          <Route path='user/:id' element={<UserProfile />} />
          <Route path='admin' element={<AdminIndex />} />
          <Route path='login' element={<LoginForm />}></Route>
          <Route path='signup' element={<SignupForm />}></Route>
          <Route path='test' element={<Test />}></Route>
          <Route path='search' element={<MobileSearch />}></Route>
        </Routes>
      </main>
    </div>
  )
}

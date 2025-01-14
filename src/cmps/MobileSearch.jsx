import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { svgService } from '../services/svg.service'

export function MobileSearch() {
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const workspaceBoards = boards?.filter((board) => !board.isGuest) || []

  return (
    <section className='mobile-search-container'>
      <div className='mobile-search'>
        <header className='mobile-search-header'>
          <h>Search</h>
        </header>

        <div className='search-input-container'>
          <input type='text' placeholder='Enter your search keyword' className='search-input' />
          <button className='info-btn'>
            <img src={svgService.infoIcon} alt='' />
          </button>
        </div>

        <section className='saved-searches'>
          <h2>Saved searches</h2>
          <div className='saved-search-item'>
            <span>@me</span>
            <button className='remove-btn'>
              <img src={svgService.crossIcon} alt='' />
            </button>
          </div>
        </section>

        <section className='recent-boards'>
          <h2>Recent boards</h2>
          {workspaceBoards.slice(0, 4).map((board) => (
            <Link to={`/board/${board._id}`} className='search-item' key={board._id}>
              <div className='item-icon'>
                <img src={svgService.boardsIcon} alt='' />
              </div>
              <div className='item-details'>
                <span className='item-title'>{board.title}</span>
                <span className='item-subtitle'> Boardllo Workspace</span>
              </div>
              <button className='favorite-btn'>
                <img src={svgService.starIcon} alt='' />
              </button>
            </Link>
          ))}
        </section>
      </div>
    </section>
  )
}

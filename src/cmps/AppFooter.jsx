import { useSelector } from 'react-redux'

export function AppFooter() {
    const count = useSelector(storeState => storeState.userModule.count)

    return (
        <footer className="app-footer main-container full">
            <section>
                <p>Coffeerights &copy; 2024</p>
                <p>Count: {count}</p>
            </section>
        </footer>
    )
}
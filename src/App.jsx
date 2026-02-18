import { RouterProvider } from 'react-router'
import { router } from './routes/index'
import "./assets/scss/all.scss";

function App() {
    return (
        <RouterProvider router={router} />
    )
}

export default App
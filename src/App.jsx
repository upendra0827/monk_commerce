import './App.css'
import ProductsDashboardContainer from './components/ProductsDashboard'
import ProductsProvider from './contexts/ProductsContext'

function App() {

  return (
    <ProductsProvider>
      <ProductsDashboardContainer />
    </ProductsProvider>
  )
}

export default App

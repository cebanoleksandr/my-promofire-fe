import MainLayout from './components/layouts/MainLayout';

// Router монтирует App как корневой Component с вложенным <Outlet/>.
// Auth-страницы (/login, /register) при необходимости вынести под отдельный layout.
function App() {
  return <MainLayout />;
}

export default App;

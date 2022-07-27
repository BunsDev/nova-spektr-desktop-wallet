import { useNavigate, useRoutes } from 'react-router-dom';

import { SplashScreen } from '@renderer/components/common';
import I18Provider from '@renderer/context/I18Context';
import MatrixProvider from '@renderer/context/MatrixContext';
import Paths from '@renderer/routes/paths';
import routesConfig from './routes';

const App = () => {
  const navigate = useNavigate();
  const appRoutes = useRoutes(routesConfig);

  const onAutoLoginFail = (errorMsg: string) => {
    console.warn(errorMsg);
    navigate(Paths.LOGIN);
  };

  return (
    <I18Provider>
      <MatrixProvider loader={<SplashScreen />} onAutoLoginFail={onAutoLoginFail}>
        {appRoutes}
      </MatrixProvider>
    </I18Provider>
  );
};

export default App;

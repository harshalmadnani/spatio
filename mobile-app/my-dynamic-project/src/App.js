import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import Main from "./Main";

const ENVIRONMENT_ID = process.env.REACT_APP_ENVIRONMENT_ID;

const App = () => (
  <DynamicContextProvider
    theme="auto"
    settings={{
      environmentId: ENVIRONMENT_ID,
    }}
  >
    <Main />
  </DynamicContextProvider>
);

export default App;

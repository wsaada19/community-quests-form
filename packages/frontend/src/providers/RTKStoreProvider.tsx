import { Provider } from "react-redux";
import { store } from "../store/store"; // import your store

const RTKStoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default RTKStoreProvider;

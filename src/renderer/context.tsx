import { useLocalObservable } from 'mobx-react-lite';
import * as React from 'react';
import { createStore, TStore } from './stores';

const storeContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }: any) => {
    const store = useLocalObservable(createStore);
    return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
};

export const useStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        throw new Error('You have forgot to use StoreProvider, shame on you.');
    }
    return store;
};

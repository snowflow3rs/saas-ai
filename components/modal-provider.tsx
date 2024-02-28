"use client";

import { useEffect, useState } from "react";
import ProModal from "./pro-modal";

import { Provider } from "react-redux";
import { store } from "@/app/redux/configStore";

export const ModalProvider = ({children}:{children:React.ReactNode}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Provider store={store}>
    <ProModal/>
    {children}
    </Provider>
  );
};

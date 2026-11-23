"use client";

import { useEffect } from "react";
import { store } from "@/Redux/store";
import { clearUser, setUser } from "@/Redux/features/UserSlice";
import { useAppDispatch } from "@/Redux/hooks";
import { authClient } from "@/components/lib/auth-client";
import { Provider } from "react-redux";

const AuthSessionSync = () => {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      dispatch(setUser(session.user));
    } else {
      dispatch(clearUser());
    }
  }, [dispatch, isPending, session]);

  return null;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthSessionSync />
      {children}
    </Provider>
  );
};

export default Providers;
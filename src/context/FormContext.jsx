import { createContext, useContext } from "react";

export const FormCtx = createContext({
  name: "Ramesh Kumar Sharma",
  email: "ramesh.sharma@gmail.com",
  mobile: "+91 98765 43210",
  setName: () => {},
  setEmail: () => {},
  setMobile: () => {},
});

export function useFormData() {
  return useContext(FormCtx);
}

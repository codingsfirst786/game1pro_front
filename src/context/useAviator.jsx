import { useContext } from "react";
import { AviatorContext } from "./AviatorProvider";
import { toast } from "react-toastify";

export const useAviator = () => {
  const context = useContext(AviatorContext);
  if (!context) {
    toast.error("useAviator must be used within an AviatorProvider");
    throw new Error("useAviator must be used within an AviatorProvider");
  }
  return context;
};

export default useAviator;

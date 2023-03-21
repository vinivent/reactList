import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

import { HouseContext } from "./HouseContext";
import { ImSpinner2 } from "react-icons/im";

export default function Private({ children }) {
  const [signed, setSigned] = useState(false);
  const { loading } = useContext(HouseContext);

  useEffect(() => {
    async function checkLogin() {
      const signed = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
          };
          localStorage.setItem("@detailsUser", JSON.stringify(userData));

          setLoading(false);
          setSigned(true);
        } else {
          setLoading(false);
          setSigned(false);
        }
      });
    }
    checkLogin();
  }, []);

  if (loading) {
    return (
      <ImSpinner2 className="mx-auto animate-spin text-blue-800 text-4xl mt-[200px]" />
    );
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  return children;
}

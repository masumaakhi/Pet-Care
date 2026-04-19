import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useProtectedNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const go = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const goProtected = useCallback(
    (path) => {
      if (!user) {
        navigate("/login");
        return;
      }
      navigate(path);
    },
    [navigate, user]
  );

  return { go, goProtected, user };
}


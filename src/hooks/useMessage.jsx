import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { createAsyncMessage } from "../slices/messageSlice";

function useMessage() {
  const dispatch = useDispatch();

  const showSuccess = useCallback(
    (message) => {
      dispatch(
        createAsyncMessage({
          success: true,
          message,
        }),
      );
    },
    [dispatch],
  );

  const showError = useCallback(
    (message) => {
      dispatch(
        createAsyncMessage({
          success: false,
          message,
        }),
      );
    },
    [dispatch],
  );

  return { showSuccess, showError };
}

export default useMessage;

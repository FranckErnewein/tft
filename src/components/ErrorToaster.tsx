import { FC, ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { SerializedError } from "../errors";

interface Props {
  error?: SerializedError | null;
}

const ErrorToaster: FC<Props> = ({ error }) => {
  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="error" sx={{ width: "100%" }}>
        {error?.message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorToaster;

import { useMemo } from "react";
import { getApi } from "../lib/api";

export function useApi() {
  return useMemo(() => getApi(), []);
}

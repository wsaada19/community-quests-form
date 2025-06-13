import { useGetConfigsQuery } from "../store/api";

/**
 * Provider for populating data that is regularly used by the application.
 * Authentication should be handled by a parent of this provider.
 */
export function RTKCacheProvider(props: { children: React.ReactNode }) {
  const { data: _configsData } = useGetConfigsQuery(undefined, {
    pollingInterval: 20000,
    skipPollingIfUnfocused: true,
  });

  return <>{props.children}</>;
}

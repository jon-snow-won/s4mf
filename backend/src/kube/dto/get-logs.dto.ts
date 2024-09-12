export class GetLogsDto {
  name: string;
  namespace: string;
  container?: string;
  follow?: boolean;
  insecureSkipTLSVerifyBackend?: boolean;
  limitBytes?: number;
  pretty?: string;
  previous?: boolean;
  sinceSeconds?: number;
  tailLines?: number;
  timestamps?: boolean;
}

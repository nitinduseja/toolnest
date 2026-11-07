export interface DockerRunParsed {
  image: string;
  name?: string;
  ports: string[];
  volumes: string[];
  environment: Record<string, string>;
  envFiles: string[];
  network?: string;
  restart?: string;
  command?: string;
  entrypoint?: string;
  user?: string;
  privileged?: boolean;
  labels: Record<string, string>;
  workdir?: string;
}

export interface DockerPreset {
  id: string;
  name: string;
  description: string;
  command: string;
}

export interface ConversionResult {
  yaml: string;
  serviceName: string;
  parsed: DockerRunParsed;
  warnings: string[];
}

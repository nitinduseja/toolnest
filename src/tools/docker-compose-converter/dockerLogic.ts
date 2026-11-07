import { DockerRunParsed, ConversionResult, DockerPreset } from './types';

export function tokenizeCommand(cmd: string): string[] {
  const sanitized = cmd.replace(/\\\r?\n/g, ' ').trim();
  const tokens: string[] = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < sanitized.length; i++) {
    const c = sanitized[i];
    if (c === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (c === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (c === ' ' && !inDouble && !inSingle) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += c;
    }
  }
  if (current.length > 0) tokens.push(current);
  return tokens;
}

export function parseDockerRun(cmd: string): DockerRunParsed {
  const tokens = tokenizeCommand(cmd);
  const parsed: DockerRunParsed = {
    image: '',
    ports: [],
    volumes: [],
    environment: {},
    envFiles: [],
    labels: {},
  };

  let i = 0;
  if (tokens[0] === 'docker') i++;
  if (tokens[i] === 'run' || tokens[i] === 'container') {
    if (tokens[i] === 'container' && tokens[i + 1] === 'run') i += 2;
    else i++;
  }

  const trailingArgs: string[] = [];
  let foundImage = false;

  while (i < tokens.length) {
    const t = tokens[i];
    if (foundImage) {
      trailingArgs.push(t);
      i++;
      continue;
    }

    if (t === '-p' || t === '--publish') {
      if (tokens[i + 1]) parsed.ports.push(tokens[i + 1]);
      i += 2;
    } else if (t === '-v' || t === '--volume') {
      if (tokens[i + 1]) parsed.volumes.push(tokens[i + 1]);
      i += 2;
    } else if (t === '-e' || t === '--env') {
      if (tokens[i + 1]) parseEnvPair(tokens[i + 1], parsed.environment);
      i += 2;
    } else if (t === '--env-file') {
      if (tokens[i + 1]) parsed.envFiles.push(tokens[i + 1]);
      i += 2;
    } else if (t === '--name') {
      parsed.name = tokens[i + 1];
      i += 2;
    } else if (t === '--network' || t === '--net') {
      parsed.network = tokens[i + 1];
      i += 2;
    } else if (t === '--restart') {
      parsed.restart = tokens[i + 1];
      i += 2;
    } else if (t === '-w' || t === '--workdir') {
      parsed.workdir = tokens[i + 1];
      i += 2;
    } else if (t === '-u' || t === '--user') {
      parsed.user = tokens[i + 1];
      i += 2;
    } else if (t === '--entrypoint') {
      parsed.entrypoint = tokens[i + 1];
      i += 2;
    } else if (t === '--privileged') {
      parsed.privileged = true;
      i++;
    } else if (
      t === '-d' ||
      t === '--detach' ||
      t === '--rm' ||
      t === '-it' ||
      t === '-i' ||
      t === '-t'
    ) {
      i++;
    } else if (!t.startsWith('-')) {
      parsed.image = t;
      foundImage = true;
      i++;
    } else {
      i++;
    }
  }

  if (trailingArgs.length > 0) {
    parsed.command = trailingArgs.join(' ');
  }

  return parsed;
}

function parseEnvPair(pair: string, envObj: Record<string, string>) {
  const eqIdx = pair.indexOf('=');
  if (eqIdx !== -1) {
    const key = pair.slice(0, eqIdx);
    const val = pair.slice(eqIdx + 1);
    envObj[key] = val;
  } else {
    envObj[pair] = '';
  }
}

export function generateComposeYaml(parsed: DockerRunParsed): string {
  const serviceName = sanitizeServiceName(parsed.name || parsed.image || 'app');
  const lines: string[] = ['version: "3.8"', '', 'services:', `  ${serviceName}:`];

  if (parsed.image) {
    lines.push(`    image: ${parsed.image}`);
  }
  if (parsed.name) {
    lines.push(`    container_name: ${parsed.name}`);
  }
  if (parsed.restart) {
    lines.push(`    restart: ${parsed.restart}`);
  }
  if (parsed.privileged) {
    lines.push('    privileged: true');
  }
  if (parsed.user) {
    lines.push(`    user: "${parsed.user}"`);
  }
  if (parsed.workdir) {
    lines.push(`    working_dir: ${parsed.workdir}`);
  }
  if (parsed.entrypoint) {
    lines.push(`    entrypoint: ${parsed.entrypoint}`);
  }
  if (parsed.command) {
    lines.push(`    command: ${parsed.command}`);
  }

  appendPorts(parsed.ports, lines);
  appendVolumes(parsed.volumes, lines);
  appendEnvironment(parsed.environment, parsed.envFiles, lines);
  appendNetworks(parsed.network, lines);

  return lines.join('\n');
}

function sanitizeServiceName(raw: string): string {
  const base = raw.split(':')[0].split('/').pop() || 'app';
  return base.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function appendPorts(ports: string[], lines: string[]) {
  if (ports.length === 0) return;
  lines.push('    ports:');
  ports.forEach((p) => lines.push(`      - "${p}"`));
}

function appendVolumes(volumes: string[], lines: string[]) {
  if (volumes.length === 0) return;
  lines.push('    volumes:');
  volumes.forEach((v) => lines.push(`      - ${v}`));
}

function appendEnvironment(env: Record<string, string>, envFiles: string[], lines: string[]) {
  if (envFiles.length > 0) {
    lines.push('    env_file:');
    envFiles.forEach((f) => lines.push(`      - ${f}`));
  }
  const keys = Object.keys(env);
  if (keys.length > 0) {
    lines.push('    environment:');
    keys.forEach((k) => lines.push(`      - ${k}=${env[k]}`));
  }
}

function appendNetworks(network: string | undefined, lines: string[]) {
  if (!network) return;
  lines.push('    networks:');
  lines.push(`      - ${network}`);
  lines.push('', 'networks:', `  ${network}:`, '    external: true');
}

export function convertDockerRunToCompose(cmd: string): ConversionResult {
  const parsed = parseDockerRun(cmd);
  const warnings: string[] = [];

  if (!parsed.image) {
    warnings.push('No Docker image specified in the command.');
  }
  if (cmd.includes('--link')) {
    warnings.push('Legacy --link flag detected. Prefer Docker networks in Compose.');
  }

  const yaml = generateComposeYaml(parsed);
  const serviceName = sanitizeServiceName(parsed.name || parsed.image || 'app');

  return { yaml, serviceName, parsed, warnings };
}

export const DOCKER_PRESETS: DockerPreset[] = [
  {
    id: 'nginx',
    name: 'Nginx Web Server',
    description: 'Port 80/443 mapping with custom HTML volume mount',
    command:
      'docker run -d --name my-nginx -p 80:80 -p 443:443 -v ./html:/usr/share/nginx/html:ro --restart always nginx:alpine',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    description: 'Postgres 16 with credentials and persistent volume',
    command:
      'docker run -d --name db-postgres -p 5432:5432 -e POSTGRES_DB=mydb -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -v postgres_data:/var/lib/postgresql/data --restart unless-stopped postgres:16-alpine',
  },
  {
    id: 'redis',
    name: 'Redis Cache',
    description: 'Redis with password authentication and persistence data volume',
    command:
      'docker run -d --name redis-cache -p 6379:6379 -v redis_data:/data redis:7-alpine redis-server --appendonly yes --requirepass secret',
  },
  {
    id: 'node-app',
    name: 'Node.js Express App',
    description: 'Node app with bind mount, port 3000, and production environment',
    command:
      'docker run -d --name my-node-app -p 3000:3000 -v $(pwd):/app -w /app -e NODE_ENV=production node:20-alpine npm start',
  },
];

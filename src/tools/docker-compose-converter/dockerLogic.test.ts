import { describe, it, expect } from 'vitest';
import {
  tokenizeCommand,
  parseDockerRun,
  convertDockerRunToCompose,
  DOCKER_PRESETS,
} from './dockerLogic';

describe('dockerLogic', () => {
  describe('tokenizeCommand', () => {
    it('splits arguments respecting quotes and line continuations', () => {
      const cmd = `docker run -d \\\n  -p "8080:80" \\\n  -e KEY="hello world" \\\n  nginx:alpine`;
      const tokens = tokenizeCommand(cmd);
      expect(tokens).toEqual([
        'docker',
        'run',
        '-d',
        '-p',
        '8080:80',
        '-e',
        'KEY=hello world',
        'nginx:alpine',
      ]);
    });
  });

  describe('parseDockerRun', () => {
    it('parses ports, volumes, environment, and container name', () => {
      const cmd =
        'docker run -d --name web -p 80:80 -v /data:/data -e APP_ENV=production node:20 npm start';
      const parsed = parseDockerRun(cmd);

      expect(parsed.name).toBe('web');
      expect(parsed.image).toBe('node:20');
      expect(parsed.ports).toEqual(['80:80']);
      expect(parsed.volumes).toEqual(['/data:/data']);
      expect(parsed.environment).toEqual({ APP_ENV: 'production' });
      expect(parsed.command).toBe('npm start');
    });

    it('parses restart, network, privileged, workdir, and user', () => {
      const cmd =
        'docker run --restart always --net custom_net --privileged -w /app -u 1000:1000 alpine:latest sh';
      const parsed = parseDockerRun(cmd);

      expect(parsed.restart).toBe('always');
      expect(parsed.network).toBe('custom_net');
      expect(parsed.privileged).toBe(true);
      expect(parsed.workdir).toBe('/app');
      expect(parsed.user).toBe('1000:1000');
      expect(parsed.command).toBe('sh');
    });
  });

  describe('generateComposeYaml & convertDockerRunToCompose', () => {
    it('generates clean docker-compose YAML', () => {
      const cmd = 'docker run -d --name my-redis -p 6379:6379 redis:alpine';
      const { yaml, serviceName } = convertDockerRunToCompose(cmd);

      expect(serviceName).toBe('my-redis');
      expect(yaml).toContain('version: "3.8"');
      expect(yaml).toContain('services:');
      expect(yaml).toContain('my-redis:');
      expect(yaml).toContain('image: redis:alpine');
      expect(yaml).toContain('container_name: my-redis');
      expect(yaml).toContain('ports:');
      expect(yaml).toContain('- "6379:6379"');
    });

    it('warns when no image is specified', () => {
      const cmd = 'docker run -p 80:80';
      const { warnings } = convertDockerRunToCompose(cmd);
      expect(warnings.some((w) => w.includes('No Docker image'))).toBe(true);
    });

    it('processes all standard presets successfully', () => {
      expect(DOCKER_PRESETS.length).toBeGreaterThanOrEqual(4);
      for (const preset of DOCKER_PRESETS) {
        const { yaml, warnings } = convertDockerRunToCompose(preset.command);
        expect(yaml).toContain('services:');
        expect(warnings).toHaveLength(0);
      }
    });
  });
});

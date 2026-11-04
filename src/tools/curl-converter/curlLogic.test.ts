import { describe, it, expect } from 'vitest';
import { parseCurl, convertCurl } from './curlLogic';

describe('cURL to Code Converter Domain Logic', () => {
  const SAMPLE_CURL = `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer my-token" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Ada Lovelace","role":"engineer"}'`;

  describe('parseCurl', () => {
    it('parses standard POST request with headers and data', () => {
      const parsed = parseCurl(SAMPLE_CURL);
      expect(parsed.method).toBe('POST');
      expect(parsed.url).toBe('https://api.example.com/v1/users');
      expect(parsed.headers['Authorization']).toBe('Bearer my-token');
      expect(parsed.headers['Content-Type']).toBe('application/json');
      expect(parsed.data).toContain('Ada Lovelace');
    });

    it('parses basic auth flags', () => {
      const curlWithAuth = `curl -u "admin:secret123" https://api.example.com/protected`;
      const parsed = parseCurl(curlWithAuth);
      expect(parsed.auth).toEqual({ user: 'admin', pass: 'secret123' });
    });
  });

  describe('convertCurl targets', () => {
    it('generates JavaScript fetch snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'fetch');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('fetch("https://api.example.com/v1/users"');
      expect(res.code).toContain('"method": "POST"');
      expect(res.code).toContain('"Authorization": "Bearer my-token"');
    });

    it('generates Axios snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'axios');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain("import axios from 'axios';");
      expect(res.code).toContain('"url": "https://api.example.com/v1/users"');
      expect(res.code).toContain('"method": "post"');
    });

    it('generates Python requests snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'python');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('import requests');
      expect(res.code).toContain('requests.post(url');
      expect(res.code).toContain('"Authorization": "Bearer my-token"');
    });

    it('generates Go net/http snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'go');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('package main');
      expect(res.code).toContain('http.NewRequest("POST", "https://api.example.com/v1/users"');
      expect(res.code).toContain('req.Header.Add("Authorization"');
    });

    it('generates Rust reqwest snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'rust');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('use reqwest::header');
      expect(res.code).toContain('client.post("https://api.example.com/v1/users")');
    });

    it('generates PHP cURL snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'php');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('<?php');
      expect(res.code).toContain('curl_init()');
      expect(res.code).toContain('CURLOPT_URL => "https://api.example.com/v1/users"');
    });

    it('generates Java HttpClient snippet', () => {
      const res = convertCurl(SAMPLE_CURL, 'java');
      expect(res.error).toBeUndefined();
      expect(res.code).toContain('java.net.http.HttpClient');
      expect(res.code).toContain('HttpRequest.newBuilder()');
    });

    it('handles empty input gracefully', () => {
      const res = convertCurl('', 'fetch');
      expect(res.code).toBe('');
      expect(res.error).toBeUndefined();
    });

    it('returns error when URL is missing', () => {
      const res = convertCurl('curl -X GET', 'fetch');
      expect(res.error).toBeDefined();
      expect(res.error).toContain('Could not detect request URL');
    });
  });
});

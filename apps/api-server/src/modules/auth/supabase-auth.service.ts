import { createPublicKey, createVerify } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SupabaseUser {
  id: string;
  email?: string;
  role?: string;
  aud?: string;
}

interface JsonWebKey {
  [key: string]: string | undefined;
  kid: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

@Injectable()
export class SupabaseAuthService {
  private jwks?: JsonWebKey[];

  constructor(private readonly configService: ConfigService) {}

  private get supabaseUrl(): string {
    const url = this.configService.get<string>('SUPABASE_URL') ?? process.env.SUPABASE_URL;
    if (!url) {
      throw new Error('SUPABASE_URL env variable is required for authentication');
    }
    return url;
  }

  async verifyAccessToken(token: string): Promise<SupabaseUser> {
    const [headerSegment, payloadSegment, signatureSegment] = token.split('.');
    if (!headerSegment || !payloadSegment || !signatureSegment) {
      throw new UnauthorizedException('Malformed JWT');
    }

    const header = JSON.parse(this.decodeSegment(headerSegment).toString('utf8')) as { kid: string };
    const payload = JSON.parse(this.decodeSegment(payloadSegment).toString('utf8')) as Record<string, unknown>;

    const jwk = await this.resolveJwk(header.kid);
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${headerSegment}.${payloadSegment}`);
    verifier.end();

    const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
    const signature = this.decodeSegment(signatureSegment);
    const isValid = verifier.verify(publicKey, signature);

    if (!isValid) {
      throw new UnauthorizedException('Signature invalide');
    }

    const issuer = `${this.supabaseUrl}/auth/v1`;
    if (payload['iss'] !== issuer || payload['aud'] !== 'authenticated') {
      throw new UnauthorizedException('Claims JWT non valides');
    }

    // Check token expiration (exp) and not-before (nbf)
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload['exp'] === 'number' && now > payload['exp']) {
      throw new UnauthorizedException('Token expiré');
    }
    if (typeof payload['nbf'] === 'number' && now < payload['nbf']) {
      throw new UnauthorizedException('Token non encore valide');
    }
    return {
      id: String(payload['sub'] ?? ''),
      email: typeof payload['email'] === 'string' ? payload['email'] : undefined,
      role: typeof payload['role'] === 'string' ? payload['role'] : undefined,
      aud: typeof payload['aud'] === 'string' ? payload['aud'] : undefined
    };
  }

  private async resolveJwk(kid: string): Promise<JsonWebKey> {
    const keys = await this.fetchJwks();
    const jwk = keys.find((key) => key.kid === kid);
    if (!jwk) {
      throw new UnauthorizedException('Aucune clé trouvée pour ce token');
    }
    return jwk;
  }

  private async fetchJwks(): Promise<JsonWebKey[]> {
    if (!this.jwks) {
      const response = await fetch(`${this.supabaseUrl}/auth/v1/certs`);
      if (!response.ok) {
        throw new UnauthorizedException('Impossible de récupérer les clés Supabase');
      }
      const { keys } = (await response.json()) as { keys: JsonWebKey[] };
      this.jwks = keys;
    }
    return this.jwks;
  }

  private decodeSegment(segment: string): Buffer {
    let input = segment.replace(/-/g, '+').replace(/_/g, '/');
    const pad = input.length % 4;
    if (pad === 2) {
      input += '==';
    } else if (pad === 3) {
      input += '=';
    } else if (pad === 1) {
      input += '===';
    }
    return Buffer.from(input, 'base64');
  }
}


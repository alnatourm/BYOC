import net from 'node:net';
import { validateUrlSsrf, isPrivateOrReservedIp } from '../utils/ssrfGuard';

export interface HostingCapability {
  providerType: 'hetzner_token' | 'digitalocean_token' | 'railway_token' | 'ssh_server';
  providerName: string;
  category: 'IaaS' | 'PaaS' | 'Self-Hosted';
  backupsSupported: boolean;
  spendCapSupported: boolean;
  predictabilityScore: 'HIGH' | 'MEDIUM' | 'LOW';
  gaps: string[];
}

export const HOSTING_CAPABILITIES_MATRIX: Record<string, HostingCapability> = {
  hetzner_token: {
    providerType: 'hetzner_token',
    providerName: 'Hetzner Cloud CX22',
    category: 'IaaS',
    backupsSupported: true,
    spendCapSupported: true,
    predictabilityScore: 'HIGH',
    gaps: ['Manual snapshot required for database rollback', 'Offsite backup dump required'],
  },
  digitalocean_token: {
    providerType: 'digitalocean_token',
    providerName: 'DigitalOcean Droplet',
    category: 'IaaS',
    backupsSupported: true,
    spendCapSupported: true,
    predictabilityScore: 'HIGH',
    gaps: ['Weekly backup window', 'Requires manual offsite database export'],
  },
  railway_token: {
    providerType: 'railway_token',
    providerName: 'Railway PaaS',
    category: 'PaaS',
    backupsSupported: true,
    spendCapSupported: true,
    predictabilityScore: 'MEDIUM',
    gaps: ['Usage-based scaling overrun risk', 'Spend limit cap alert setup required'],
  },
  ssh_server: {
    providerType: 'ssh_server',
    providerName: 'Custom SSH Linux Server',
    category: 'Self-Hosted',
    backupsSupported: false,
    spendCapSupported: false,
    predictabilityScore: 'LOW',
    gaps: ['Client responsible for server OS patching and security hardening', 'No managed database backup'],
  },
};

export async function verifyHostingToken(
  type: 'hetzner_token' | 'digitalocean_token' | 'railway_token' | 'ssh_server',
  secretTokenOrHost: string
): Promise<{ verified: boolean; error?: string; metadata?: any }> {
  try {
    if (type === 'hetzner_token') {
      const res = await fetch('https://api.hetzner.cloud/v1/servers?per_page=1', {
        headers: {
          Authorization: `Bearer ${secretTokenOrHost.trim()}`,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        return { verified: true, metadata: { serverCount: data.servers?.length || 0 } };
      }
      return { verified: false, error: `Hetzner verification failed with HTTP ${res.status}` };
    }

    if (type === 'digitalocean_token') {
      const res = await fetch('https://api.digitalocean.com/v2/account', {
        headers: {
          Authorization: `Bearer ${secretTokenOrHost.trim()}`,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        return { verified: true, metadata: { email: data.account?.email } };
      }
      return { verified: false, error: `DigitalOcean verification failed with HTTP ${res.status}` };
    }

    if (type === 'railway_token') {
      const res = await fetch('https://backboard.railway.app/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secretTokenOrHost.trim()}`,
        },
        body: JSON.stringify({
          query: `query { me { id email } }`,
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data.data?.me?.id) {
          return { verified: true, metadata: { id: data.data.me.id, email: data.data.me.email } };
        }
        return { verified: false, error: 'Railway GraphQL authentication failed or invalid token.' };
      }
      return { verified: false, error: `Railway verification failed with HTTP ${res.status}` };
    }

    if (type === 'ssh_server') {
      // Secret is format host or host:port
      let host = secretTokenOrHost.trim();
      let port = 22;
      if (host.includes(':')) {
        const parts = host.split(':');
        host = parts[0];
        port = parseInt(parts[1], 10) || 22;
      }

      if (net.isIP(host) && isPrivateOrReservedIp(host)) {
        return { verified: false, error: 'SSRF_GUARD_REJECT: SSH host resolves to a prohibited private or reserved IP address.' };
      }

      return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.on('connect', () => {
          socket.destroy();
          resolve({ verified: true, metadata: { host, port } });
        });

        socket.on('timeout', () => {
          socket.destroy();
          resolve({ verified: false, error: 'SSH connection timed out after 5 seconds.' });
        });

        socket.on('error', (err) => {
          socket.destroy();
          resolve({ verified: false, error: `SSH connection error: ${err.message}` });
        });

        socket.connect(port, host);
      });
    }

    return { verified: false, error: 'UNSUPPORTED_HOSTING_TYPE' };
  } catch (err: any) {
    return { verified: false, error: err.message || 'Verification call failed' };
  }
}

export function generateSshKeyPair() {
  return {
    publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyForBYOCByoPlatformClient',
    setupScript: '# Run on target server:\nmkdir -p ~/.ssh && chmod 700 ~/.ssh\necho "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyForBYOCByoPlatformClient" >> ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/authorized_keys',
  };
}

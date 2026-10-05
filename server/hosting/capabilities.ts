import crypto from 'node:crypto';

export interface HostingCapabilities {
  providerType: 'railway_token' | 'hetzner_token' | 'digitalocean_token' | 'ssh_server';
  label: string;
  provisioning: string;
  backups: string;
  hardSpendCap: string;
  predictability: string;
  capabilityGaps: string[];
}

export const HOSTING_CAPABILITIES_MATRIX: Record<string, HostingCapabilities> = {
  railway_token: {
    providerType: 'railway_token',
    label: 'Railway PaaS (Client Account)',
    provisioning: 'Automated GraphQL API Service & Postgres Provisioning',
    backups: 'Volume snapshots supported (must be verified & enabled)',
    hardSpendCap: 'Workspace-wide hard spend limit (takes services offline when reached)',
    predictability: 'Usage-based execution hours & resource meters',
    capabilityGaps: [],
  },
  hetzner_token: {
    providerType: 'hetzner_token',
    label: 'Hetzner Cloud Project Token',
    provisioning: 'Server VM API creation (Requires dedicated empty Hetzner project)',
    backups: 'Provider server backup add-on required',
    hardSpendCap: 'No automatic hard spend cap; billing alerts recommended',
    predictability: 'Fixed predictable monthly server pricing',
    capabilityGaps: [
      'Token is bound to a single Hetzner project; client must create an empty project.',
      'Manual database snapshot configuration required for point-in-time recovery.',
    ],
  },
  digitalocean_token: {
    providerType: 'digitalocean_token',
    label: 'DigitalOcean Personal Access Token',
    provisioning: 'Droplet VM creation over REST API',
    backups: 'Droplet weekly backup feature available',
    hardSpendCap: 'No hard spend limit; custom scope tokens recommended',
    predictability: 'Fixed monthly droplet rate',
    capabilityGaps: ['Client must grant scoped Droplet read/write permissions.'],
  },
  ssh_server: {
    providerType: 'ssh_server',
    label: 'Own Server over SSH (Docker + Caddy)',
    provisioning: 'Client-provisioned server (Ubuntu / Debian)',
    backups: 'Client-managed database backup job required',
    hardSpendCap: 'Client-owned infrastructure',
    predictability: 'Client server cost',
    capabilityGaps: ['Client is responsible for server uptime, disk space, and firewall configuration.'],
  },
};

export function generateSshKeyPair(): { publicKey: string; privateKey: string; setupScript: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const setupScript = `#!/bin/bash
# OGroup AI Factory - SSH Deploy User Setup Script
# Review before running on your server.
set -e
sudo useradd -m -s /bin/bash deploy_factory || true
sudo mkdir -p /home/deploy_factory/.ssh
sudo chmod 700 /home/deploy_factory/.ssh
echo "${publicKey.trim()}" | sudo tee -a /home/deploy_factory/.ssh/authorized_keys
sudo chmod 600 /home/deploy_factory/.ssh/authorized_keys
sudo chown -R deploy_factory:deploy_factory /home/deploy_factory/.ssh
echo "✅ Deploy user configured successfully."`;

  return { publicKey, privateKey, setupScript };
}

export async function verifyHostingToken(
  type: 'railway_token' | 'hetzner_token' | 'digitalocean_token' | 'ssh_server',
  secret: string
): Promise<{ verified: boolean; message: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    if (type === 'hetzner_token') {
      const res = await fetch('https://api.hetzner.cloud/v1/servers?per_page=1', {
        headers: { Authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return { verified: res.ok, message: res.ok ? 'Hetzner API token verified.' : `Hetzner API error ${res.status}` };
    }

    if (type === 'digitalocean_token') {
      const res = await fetch('https://api.digitalocean.com/v2/account', {
        headers: { Authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return { verified: res.ok, message: res.ok ? 'DigitalOcean account token verified.' : `DigitalOcean error ${res.status}` };
    }

    if (type === 'railway_token') {
      // Confirmed Railway GraphQL endpoint header query
      const res = await fetch('https://backboard.railway.com/graphql/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ query: 'query { me { id email } }' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return { verified: res.ok, message: res.ok ? 'Railway GraphQL API token verified.' : `Railway error ${res.status}` };
    }

    if (type === 'ssh_server') {
      clearTimeout(timeout);
      return { verified: true, message: 'SSH Keypair generated. Deploy user setup script ready.' };
    }

    clearTimeout(timeout);
    return { verified: false, message: 'Unknown hosting type' };
  } catch (err: any) {
    clearTimeout(timeout);
    return { verified: false, message: err?.message || 'Hosting verification failed' };
  }
}

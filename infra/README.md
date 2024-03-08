# Infra for hr db

This is used to deploy the web application on 26 URLs
(from a.hr.dmerej.info to z.hr.dmerej.info)

Steps:

 * Create a new droplet on Digital Ocean
 * Add authentification with your public key
 * Add `A` record form hr.dmerej.info with the public IPv4 address of the droplet
 * Add the same `A` record for `*.hr`


* Copy tmux config

```
scp ~/.tmux.conf root@hr.dmerej.info:
``

```bash
ssh root@hr.dmerej.info
# Deploy nginx *before* deploying anything, because
# we need certbot to work
apt install \
  certbot \
  kakoune \
  kitty-terminfo \
  nginx \
  python-is-python3 \
  python3-poetry \
  python3-venv \
  rsync \
  tmux \
# Create hr system user in `/srv/hr`
addgroup --system hr
adduser --system --home /srv/hr hr --group hr

mkdir /srv/hr/.ssh
cp .ssh/authorized_keys /srv/hr/.ssh/
mkdir /srv/hr/src
mkdir /srv/hr/data
mkdir /var/log/hr
chown -Rc hr:hr /srv/hr
chown -Rc hr:hr /var/log/hr
chsh -s /bin/bash hr
```

Make sure `curl hr.dmerej.info` and `curl a.hr.dmerej.info` both work -
and then *stop* nginx so that certbot can run in "standalone" mode:

```
ssh root@hr.dmerej.info
# For the top-level:
certbot certonly -d hr.dmerej.info --standalone
# For all letters:
certbot certonly -d a.hr.dmerej.info --standalone
```

Create poetry virtual envs for both groups
```bash
scp ~/.tmux.conf hr@hr.dmerej.info:
ssh hr@hr.dmerej.info
cd /srv/hr/src/group1
python -m venv .venv
source .venv/bin/activate
poetry install --sync --only main
deactivate
cd /srv/hr/src/group2
python -m venv .venv
source .venv/bin/activate
poetry install --sync --only main
```

```bash
python automation.py deploy-backend --group 1
python automation.py deploy-backend --group 2
python automation.py deploy-systemd
python automation.py deploy-nginx
python automation.py reset-dbs
```

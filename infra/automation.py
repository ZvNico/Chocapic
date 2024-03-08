import os
import subprocess
import sys
from argparse import ArgumentParser
from pathlib import Path

SRC_PATH = Path(".").resolve().parent
DJANGO_DB_PATH = SRC_PATH / "backend/db.sqlite3"

LETTERS = {
    1: list("abcdefghijklm"),
    2: list("nopqrstuvwxyz"),
}
ALL_LETTERS = LETTERS[1] + LETTERS[2]


def get_letters(group):
    res = LETTERS[group]
    assert len(res) == 13
    return res


def group_from_letter(letter):
    if letter in LETTERS[1]:
        return 1
    if letter in LETTERS[2]:
        return 2
    assert False, f"letter {letter} not found"


def run(cwd, cmd, **kwargs):
    print(f"{cwd}$", *cmd)
    process = subprocess.run(cmd, check=False, cwd=cwd, **kwargs)
    rc = process.returncode
    if rc != 0:
        sys.exit(rc)


def rsync(src, url, *, excludes=None):
    src = str(src) + "/"
    cmd = ["rsync", "--recursive", "--itemize-changes"]
    if excludes:
        cmd.extend(["--exclude-from", excludes])
    cmd.extend([src, url])
    run(Path.cwd(), cmd)


def ssh(url, cmd):
    cmd = ["ssh", url, cmd]
    run(Path.cwd(), cmd)


def scp(src, url):
    cmd = ["scp", src, url]
    run(Path.cwd(), cmd)


def scp_multi(sources, url):
    cmd = ["scp", *sources, url]
    run(Path.cwd(), cmd)


def generate_from_template(in_path, gen_path, letter):
    in_text = in_path.read_text()
    out_text = in_text.replace("@letter@", letter)
    group = group_from_letter(letter)
    out_text = out_text.replace("@group@", str(group))
    gen_parent_path = gen_path.parent
    gen_parent_path.mkdir(exist_ok=True)
    gen_path.write_text(out_text)
    print("Generated", gen_path)


def generate_nginx_server_conf(c):
    in_path = SRC_PATH / "infra/nginx/servers/sub.conf.in"
    gen_path = SRC_PATH / f"infra/nginx/servers/gen/{c}.conf"
    generate_from_template(in_path, gen_path, c)

    in_path = SRC_PATH / "infra/nginx/upstreams/conf.in"
    gen_path = SRC_PATH / f"infra/nginx/upstreams/gen/{c}.conf"
    generate_from_template(in_path, gen_path, c)


def deploy_nginx(args):
    for c in ALL_LETTERS:
        generate_nginx_server_conf(c)
    src = SRC_PATH / "infra/nginx"
    rsync(src, "root@hr.dmerej.info:/etc/nginx")
    ssh("root@hr.dmerej.info", "nginx -t")
    ssh("root@hr.dmerej.info", "nginx -s reload")


def deploy_backend(args):
    src = SRC_PATH / "backend"
    excludes_file = src / ".rsyncexcludes"
    group = args.group
    rsync(src, f"hr@hr.dmerej.info:src/group{group}", excludes=excludes_file)

    restart_backend(args)


def restart_backend(args):
    to_restart = [f"gunicorn-{c}.service" for c in ALL_LETTERS]
    ssh("root@hr.dmerej.info", f"systemctl restart {' '.join(to_restart)}")


def migrate_django_db():
    cwd = SRC_PATH / "backend"
    DJANGO_DB_PATH.unlink(missing_ok=True)
    cmd = ["poetry", "run", "python", "manage.py", "migrate"]
    run(cwd, cmd)


def re_init_remote_dbs():
    # Copy the newly migrated db
    scp(DJANGO_DB_PATH, "hr@hr.dmerej.info:/srv/hr/data/init.db")

    # Copy the script and run it
    local_script = SRC_PATH / "infra/re-init-dbs.sh"
    remote_script = "/srv/hr/data/re-init-dbs.sh"
    scp(local_script, f"hr@hr.dmerej.info:{remote_script}")
    ssh("hr@hr.dmerej.info", remote_script)


def reset_dbs(args):
    migrate_django_db()
    re_init_remote_dbs()


def deploy_systemd(args):
    to_copy = []
    for letter in ALL_LETTERS:
        src_path = SRC_PATH / "infra/systemd/gunicorn.in.socket"
        gen_path = SRC_PATH / f"infra/systemd/gen/gunicorn-{letter}.socket"
        generate_from_template(src_path, gen_path, letter)
        to_copy.append(gen_path)

        src_path = SRC_PATH / "infra/systemd/gunicorn.in.service"
        gen_path = SRC_PATH / f"infra/systemd/gen/gunicorn-{letter}.service"
        generate_from_template(src_path, gen_path, letter)
        to_copy.append(gen_path)

    dest_path = f"root@hr.dmerej.info:/etc/systemd/system"
    scp_multi(to_copy, dest_path)

    ssh("root@hr.dmerej.info", "systemctl daemon-reload")
    restart_backend(args)


def main():
    parser = ArgumentParser()
    actions = parser.add_subparsers(help="available actions", dest="action")

    deploy_backend_parser = actions.add_parser("deploy-backend")
    deploy_backend_parser.add_argument(
        "--group", required=True, choices=[1, 2], type=int
    )
    deploy_backend_parser.set_defaults(action=deploy_backend)

    deploy_systemd_parser = actions.add_parser("deploy-systemd")
    deploy_systemd_parser.set_defaults(action=deploy_systemd)

    deploy_nginx_parser = actions.add_parser("deploy-nginx")
    deploy_nginx_parser.set_defaults(action=deploy_nginx)

    reset_db_parser = actions.add_parser("reset-dbs")
    reset_db_parser.set_defaults(action=reset_dbs)

    restart_backend_parsed = actions.add_parser("restart-backend")
    restart_backend_parsed.set_defaults(action=restart_backend)

    args = parser.parse_args()
    if not args.action:
        parser.print_help()
        sys.exit(2)

    args.action(args)


if __name__ == "__main__":
    main()

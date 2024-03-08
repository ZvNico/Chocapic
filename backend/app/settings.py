import os
import string
from pathlib import Path

import dotenv
from django import template
import dj_database_url

dotenv.load_dotenv()

register = template.Library()

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get("DJANGO_DEBUG") == "true"

if DEBUG:
    SECRET_KEY = "insecure-secret"
else:
    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]


ALLOWED_HOSTS = ["localhost", "127.0.0.1", "hr.dmerej.info"]
for c in string.ascii_lowercase:
    ALLOWED_HOSTS.append(c + ".hr.dmerej.info")

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_browser_reload",
    "django_bootstrap5",
    "hr",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
            "loaders": [
                "hamlpy.template.loaders.HamlPyFilesystemLoader",
                "hamlpy.template.loaders.HamlPyAppDirectoriesLoader",
                (
                    "django.template.loaders.cached.Loader",
                    [
                        "django.template.loaders.filesystem.Loader",
                        "django.template.loaders.app_directories.Loader",
                    ],
                ),
            ],
        },
    }
]
WSGI_APPLICATION = "app.wsgi.application"


DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3")

DATABASES = {
    "default":  dj_database_url.parse(DATABASE_URL)
}

# NOTE: don't do this in real life, it will leak the database password :)
print(DATABASES)


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_TZ = True


STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = ["http://127.0.0.1:8080", "https://hr.dmerej.info"]
CORS_ALLOW_CREDENTIALS = True

FROM python:3.11-slim


RUN apt update && apt install -y \
  build-essential \
  curl \
  locales \
  wget


RUN addgroup --system app && adduser --system --group app --home /app

# Some programs don't like the default C.UTF-8 locale, make sure we'en en_US UTF-8
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:UTF-8
ENV LC_ALL=en_US.UTF-8

USER app

WORKDIR /app
RUN chown app:app .
USER app
RUN mkdir src
RUN mkdir data

RUN pip install poetry

WORKDIR /app/src

COPY --chown=app:app pyproject.toml /app/src
COPY --chown=app:app poetry.lock /app/src

RUN python -m poetry install --only main --no-root

COPY --chown=app:app manage.py /app/src
COPY --chown=app:app app /app/src/app
COPY --chown=app:app static /app/src/static
COPY --chown=app:app templates /app/src/templates
COPY --chown=app:app hr /app/src/hr
COPY --chown=app:app start.sh /app/src/start.sh

ENV DJANGO_SECRET_KEY=s3cr3t
ENV PYTHONUNBUFFERED=true
ENV DJANGO_DB_PATH=/app/data/db.sqlite

EXPOSE 8000
CMD /app/src/start.sh

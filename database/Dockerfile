FROM postgres:16-alpine

ENV POSTGRES_DB="goal-tracker"
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=root
ENV USER_READ_ONLY=root_ro
ENV PASSWORD_READ_ONLY=root_ro

RUN echo "CREATE USER $USER_READ_ONLY WITH PASSWORD '$PASSWORD_READ_ONLY';" >> /docker-entrypoint-initdb.d/init.sql \
    && echo "GRANT SELECT ON ALL TABLES IN SCHEMA public TO $USER_READ_ONLY;" >> /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432
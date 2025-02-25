# pull official base image
FROM python:3.8-slim-bullseye

# install dependencies
RUN apt-get update && apt-get install -y apt-transport-https \
    libssl-dev libffi-dev gcc python3-dev musl-dev build-essential \
    libpq-dev netcat-openbsd

# set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory
WORKDIR /usr/src/app

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# add and install requirements
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# add app
COPY . /usr/src/app
# set entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

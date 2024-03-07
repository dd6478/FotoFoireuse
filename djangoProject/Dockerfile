FROM python:3.12
LABEL authors="dd64"

WORKDIR /FotoFoireuseDjango
COPY . .
RUN python3 -m venv .venv
COPY pythonLib.txt .
RUN pip install --no-cache-dir -r pythonLib.txt

#CMD ["python", "manage.py", "migrate"]
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

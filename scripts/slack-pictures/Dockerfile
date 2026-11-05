# Image of the nightly job: Python, requests and the script.
FROM python:3.14-alpine
# Print each line as it happens, so the job's log can be followed
ENV PYTHONUNBUFFERED=1
WORKDIR /slack-pictures
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY sync.py ./
CMD ["python", "sync.py"]

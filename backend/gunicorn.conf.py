import multiprocessing
import os

# Server socket
bind = '0.0.0.0:' + os.environ.get('PORT', '8000')

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
loglevel = 'info'
accesslog = '-'
errorlog = '-'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(L)s seconds'

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Server mechanics
# ====================
# Load application code before the worker processes are forked.
# preload_app = True

# Maximum number of requests a worker will process before restarting
max_requests = 1000
max_requests_jitter = 50

# Daemonize the Gunicorn process (don't use this in Docker)
# daemon = False
# pidfile = 'gunicorn.pid'

# User/Group to run as
# user = 'nobody'
# group = 'nobody'

# SSL (uncomment and configure if using SSL)
# keyfile = '/path/to/privkey.pem'
# certfile = '/path/to/cert.pem'
# ssl_version = 'TLSv1_2'

""
Utility to wait for database to be available before starting Django.
"""
import os
import sys
import time
import psycopg2
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand


def wait_for_db():
    """Wait for database to be available."""
    dbname = os.getenv('POSTGRES_DB', 'postgres')
    user = os.getenv('POSTGRES_USER', 'postgres')
    password = os.getenv('POSTGRES_PASSWORD', 'postgres')
    host = os.getenv('POSTGRES_HOST', 'db')
    port = os.getenv('POSTGRES_PORT', '5432')

    max_retries = 30
    retry_count = 0
    retry_delay = 1  # seconds

    while retry_count < max_retries:
        try:
            conn = psycopg2.connect(
                dbname=dbname,
                user=user,
                password=password,
                host=host,
                port=port
            )
            conn.close()
            print('Database is available!')
            return True
        except Exception as e:
            print(f'Waiting for database... (attempt {retry_count + 1}/{max_retries})')
            time.sleep(retry_delay)
            retry_count += 1

    print('Error: Could not connect to the database after multiple attempts.')
    return False


class Command(BaseCommand):
    """Django command to wait for database."""

    def handle(self, *args, **options):
        """Handle the command."""
        if not wait_for_db():
            sys.exit(1)

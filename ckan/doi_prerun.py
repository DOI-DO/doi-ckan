  
import os
import re
import subprocess
import sys
import time
import urllib

import prerun as pr
import psycopg2

if __name__ == '__main__':

    maintenance = os.environ.get('MAINTENANCE_MODE', '').lower() == 'true'

    if maintenance:
        print('[prerun] Maintenance mode, skipping setup...')
    else:
        pr.check_main_db_connection()
        pr.init_db()
        pr.update_plugins()
        pr.check_solr_connection()
        pr.create_sysadmin()
